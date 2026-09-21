-- LeadFlow demo seed. Run AFTER signing up once via the app (so your
-- profile row exists), replacing DEMO_USER_ID with your auth user id:
--   select id, email from public.profiles;
--
-- Then run this file in Supabase Dashboard → SQL Editor.
-- Lead "created" activities are generated automatically by the trigger.

do $$
declare
  demo_user uuid := 'DEMO_USER_ID';
begin
  insert into public.leads
    (user_id, name, email, phone, company, value, stage, source, priority, expected_close)
  values
    (demo_user, 'Ava Thompson', 'ava@brightleaf.co', '+1 415 555 0132', 'Brightleaf Studio', 4500, 'new', 'Website', 'high', current_date + 21),
    (demo_user, 'Marcus Chen', 'marcus@northwind.io', '+1 212 555 0178', 'Northwind Traders', 12000, 'contacted', 'Referral', 'high', current_date + 30),
    (demo_user, 'Sofia Reyes', 'sofia@cafecolibri.com', '+1 305 555 0144', 'Café Colibrí', 2800, 'qualified', 'Instagram', 'medium', current_date + 14),
    (demo_user, 'James Okafor', 'james@okaforlegal.com', '+1 312 555 0190', 'Okafor Legal', 8500, 'proposal', 'Google', 'high', current_date + 10),
    (demo_user, 'Lena Fischer', 'lena@fischerfit.de', '+49 170 555 0112', 'Fischer Fit', 3200, 'won', 'Referral', 'medium', current_date - 5),
    (demo_user, 'Diego Morales', 'diego@moralesauto.mx', '+52 55 5553 0198', 'Morales Auto', 6700, 'lost', 'Cold call', 'low', current_date - 12),
    (demo_user, 'Priya Nair', 'priya@nairconsulting.in', '+91 98 5550 1234', 'Nair Consulting', 5400, 'contacted', 'LinkedIn', 'medium', current_date + 25),
    (demo_user, 'Tom Baker', 'tom@bakerplumbing.co', '+1 617 555 0166', 'Baker Plumbing', 1900, 'new', 'Website', 'low', current_date + 35);

  -- A couple of sample notes (activities of type 'note_added' are added by the app).
  insert into public.notes (lead_id, user_id, content)
  select l.id, demo_user, n.content
  from public.leads l
  join (values
    ('Marcus Chen', 'Had a great intro call — wants pricing for 3 locations.'),
    ('James Okafor', 'Sent proposal v2 with onboarding discount. Follow up Friday.')
  ) as n(name, content) on n.name = l.name
  where l.user_id = demo_user;
end;
$$;
