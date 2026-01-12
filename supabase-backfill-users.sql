insert into public.users (id, email, name, grade, avatar, phone, address)
select
  au.id,
  au.email,
  split_part(au.email, '@', 1) as name,
  '초등 3학년' as grade,
  U&'\\1F600' as avatar,
  null as phone,
  null as address
from auth.users au
left join public.users pu on pu.id = au.id
where pu.id is null;
