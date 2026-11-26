-- Allow enquiries to provide either phone or email (at least one required).

drop policy if exists "Public can submit enquiries" on public.enquiries;
create policy "Public can submit enquiries"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (
    char_length(trim(name)) between 2 and 100
    and char_length(trim(message)) between 10 and 1000
    and status = 'new'
    and (
      char_length(trim(phone)) between 10 and 17
      or char_length(trim(email)) between 5 and 255
    )
    and (char_length(trim(phone)) = 0 or char_length(trim(phone)) between 10 and 17)
    and (char_length(trim(email)) = 0 or char_length(trim(email)) between 5 and 255)
  );
