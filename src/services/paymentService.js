import { supabase } from '../lib/supabase';

// 토스페이먼츠 클라이언트 키 (실제 키로 교체 필요)
const TOSS_CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

class PaymentService {
  // 구독 플랜 정보
  getSubscriptionPlans() {
    return [
      {
        id: '1month',
        name: '1개월 구독',
        duration: '1개월',
        price: 15000,
        description: '매월 신문 배송 (4회)',
        features: ['주 1회 배송', '온라인 열람', '독자후기 작성']
      },
      {
        id: '3months',
        name: '3개월 구독',
        duration: '3개월',
        price: 40000,
        originalPrice: 45000,
        discount: 5000,
        description: '매월 신문 배송 (12회)',
        features: ['주 1회 배송', '온라인 열람', '독자후기 작성', '5,000원 할인'],
        popular: true
      },
      {
        id: '6months',
        name: '6개월 구독',
        duration: '6개월',
        price: 75000,
        originalPrice: 90000,
        discount: 15000,
        description: '매월 신문 배송 (24회)',
        features: ['주 1회 배송', '온라인 열람', '독자후기 작성', '15,000원 할인', '특별 선물 증정']
      },
      {
        id: '12months',
        name: '12개월 구독',
        duration: '12개월',
        price: 140000,
        originalPrice: 180000,
        discount: 40000,
        description: '매월 신문 배송 (48회)',
        features: ['주 1회 배송', '온라인 열람', '독자후기 작성', '40,000원 할인', '프리미엄 선물 증정']
      }
    ];
  }

  // 주문 ID 생성
  generateOrderId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `ORDER_${timestamp}_${random}`;
  }

  // 구독 정보 저장 (결제 전)
  async createSubscription(userId, planId, deliveryInfo) {
    const plans = this.getSubscriptionPlans();
    const plan = plans.find(p => p.id === planId);

    if (!plan) {
      throw new Error('유효하지 않은 구독 플랜입니다.');
    }

    const orderId = this.generateOrderId();

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_type: planId,
        plan_name: plan.name,
        amount: plan.price,
        payment_method: 'pending',
        order_id: orderId,
        status: 'pending',
        delivery_name: deliveryInfo.name,
        delivery_phone: deliveryInfo.phone,
        delivery_address: deliveryInfo.address
      })
      .select()
      .single();

    if (error) throw error;

    return {
      subscription: data,
      orderId: orderId,
      amount: plan.price,
      planName: plan.name
    };
  }

  // 토스페이먼츠 결제창 열기
  async requestPayment(orderId, amount, planName, paymentMethod) {
    return new Promise((resolve, reject) => {
      if (!window.TossPayments) {
        reject(new Error('토스페이먼츠 SDK가 로드되지 않았습니다.'));
        return;
      }

      const tossPayments = window.TossPayments(TOSS_CLIENT_KEY);

      const paymentConfig = {
        amount: amount,
        orderId: orderId,
        orderName: planName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      };

      if (paymentMethod === 'card') {
        tossPayments.requestPayment('카드', paymentConfig)
          .then(resolve)
          .catch(reject);
      } else if (paymentMethod === 'virtual_account') {
        tossPayments.requestPayment('가상계좌', {
          ...paymentConfig,
          validHours: 72, // 가상계좌 유효시간 (72시간)
          cashReceipt: {
            type: '소득공제'
          }
        })
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error('지원하지 않는 결제 수단입니다.'));
      }
    });
  }

  // 결제 승인 (백엔드에서 처리해야 하지만, 여기서는 클라이언트에서 처리)
  async confirmPayment(paymentKey, orderId, amount) {
    try {
      // 실제 프로덕션에서는 백엔드 API를 통해 처리해야 합니다
      const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa('test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R:')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '결제 승인에 실패했습니다.');
      }

      const paymentData = await response.json();

      // Supabase에 결제 정보 업데이트
      const startDate = new Date();
      let endDate = new Date(startDate);

      // 구독 플랜에 따라 종료일 계산
      const subscription = await this.getSubscriptionByOrderId(orderId);
      if (subscription) {
        const monthsToAdd = {
          '1month': 1,
          '3months': 3,
          '6months': 6,
          '12months': 12
        }[subscription.plan_type] || 1;

        endDate.setMonth(endDate.getMonth() + monthsToAdd);

        const updateData = {
          payment_key: paymentKey,
          payment_method: paymentData.method,
          status: 'paid',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          updated_at: new Date().toISOString()
        };

        // 가상계좌인 경우 가상계좌 정보 저장
        if (paymentData.virtualAccount) {
          updateData.virtual_account_bank = paymentData.virtualAccount.bankCode;
          updateData.virtual_account_number = paymentData.virtualAccount.accountNumber;
          updateData.virtual_account_holder = paymentData.virtualAccount.customerName;
          updateData.virtual_account_due_date = paymentData.virtualAccount.dueDate;
        }

        const { error } = await supabase
          .from('subscriptions')
          .update(updateData)
          .eq('order_id', orderId);

        if (error) throw error;
      }

      return paymentData;
    } catch (error) {
      console.error('결제 승인 오류:', error);
      throw error;
    }
  }

  // 주문 ID로 구독 정보 조회
  async getSubscriptionByOrderId(orderId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) throw error;
    return data;
  }

  // 사용자 구독 목록 조회
  async getUserSubscriptions(userId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // 활성 구독 확인
  async getActiveSubscription(userId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'paid')
      .gte('end_date', new Date().toISOString())
      .order('end_date', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116: no rows returned
    return data;
  }
}

export const paymentService = new PaymentService();
