import React, { useState } from 'react';

export default function AddressInput({ address, detailAddress, onAddressChange, disabled = false }) {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchAddress = () => {
    if (disabled) return;

    setIsSearching(true);
    new window.daum.Postcode({
      oncomplete: function(data) {
        // 도로명 주소나 지번 주소 선택
        const fullAddress = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;

        onAddressChange({
          address: fullAddress,
          zonecode: data.zonecode
        });

        setIsSearching(false);
      },
      onclose: function() {
        setIsSearching(false);
      }
    }).open();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 font-bold mb-2">
          주소 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            placeholder="주소 검색 버튼을 클릭하세요"
            readOnly
            disabled={disabled}
            className={`flex-1 px-4 py-3 rounded-xl border-2 outline-none transition-colors ${
              disabled
                ? 'border-gray-100 bg-gray-50 text-gray-600'
                : 'border-gray-200 bg-white cursor-not-allowed'
            }`}
          />
          <button
            type="button"
            onClick={handleSearchAddress}
            disabled={disabled}
            className={`px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${
              disabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-sky-500 text-white hover:bg-sky-600'
            }`}
          >
            {isSearching ? '검색 중...' : '주소 검색'}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-bold mb-2">
          상세주소 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={detailAddress}
          onChange={(e) => onAddressChange({ detailAddress: e.target.value })}
          placeholder="상세주소를 입력하세요 (예: 101동 1001호)"
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors ${
            disabled
              ? 'border-gray-100 bg-gray-50 text-gray-600'
              : 'border-gray-200 focus:border-sky-400'
          }`}
        />
      </div>
    </div>
  );
}
