-- Seed data for testing: Past 3 weeks of submissions with 0-10 daily submissions
-- Run this with: wrangler d1 execute openform-db --local --file=./seed.sql

-- First, ensure we have a test form
INSERT OR IGNORE INTO forms (id, name, created_at, updated_at)
VALUES ('test-form-1', 'Test Contact Form', CAST(strftime('%s', 'now') AS INTEGER) * 1000, CAST(strftime('%s', 'now') AS INTEGER) * 1000);

-- Day 1 (21 days ago) - 3 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-1-1', 'test-form-1', '{"name":"Alice Johnson","email":"alice@example.com","message":"Great product!"}', CAST(strftime('%s', 'now', '-21 days', 'start of day') AS INTEGER) * 1000),
('sub-1-2', 'test-form-1', '{"name":"Bob Smith","email":"bob@example.com","message":"When will you add dark mode?"}', CAST(strftime('%s', 'now', '-21 days', 'start of day', '+3 hours') AS INTEGER) * 1000),
('sub-1-3', 'test-form-1', '{"name":"Carol White","email":"carol@example.com","message":"Thanks for the help!"}', CAST(strftime('%s', 'now', '-21 days', 'start of day', '+6 hours') AS INTEGER) * 1000);

-- Day 2 (20 days ago) - 7 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-2-1', 'test-form-1', '{"name":"David Brown","email":"david@example.com","message":"How do I reset my password?"}', CAST(strftime('%s', 'now', '-20 days', 'start of day') AS INTEGER) * 1000),
('sub-2-2', 'test-form-1', '{"name":"Emma Davis","email":"emma@example.com","message":"Love the new features!"}', CAST(strftime('%s', 'now', '-20 days', 'start of day', '+2 hours') AS INTEGER) * 1000),
('sub-2-3', 'test-form-1', '{"name":"Frank Miller","email":"frank@example.com","message":"Experiencing slow load times"}', CAST(strftime('%s', 'now', '-20 days', 'start of day', '+5 hours') AS INTEGER) * 1000),
('sub-2-4', 'test-form-1', '{"name":"Grace Lee","email":"grace@example.com","message":"Can you add export to CSV?"}', CAST(strftime('%s', 'now', '-20 days', 'start of day', '+8 hours') AS INTEGER) * 1000),
('sub-2-5', 'test-form-1', '{"name":"Henry Wilson","email":"henry@example.com","message":"Payment went through!"}', CAST(strftime('%s', 'now', '-20 days', 'start of day', '+11 hours') AS INTEGER) * 1000),
('sub-2-6', 'test-form-1', '{"name":"Iris Taylor","email":"iris@example.com","message":"Question about pricing"}', CAST(strftime('%s', 'now', '-20 days', 'start of day', '+14 hours') AS INTEGER) * 1000),
('sub-2-7', 'test-form-1', '{"name":"Jack Anderson","email":"jack@example.com","message":"API documentation needed"}', CAST(strftime('%s', 'now', '-20 days', 'start of day', '+17 hours') AS INTEGER) * 1000);

-- Day 3 (19 days ago) - 2 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-3-1', 'test-form-1', '{"name":"Kate Martinez","email":"kate@example.com","message":"Webhook integration?"}', CAST(strftime('%s', 'now', '-19 days', 'start of day') AS INTEGER) * 1000),
('sub-3-2', 'test-form-1', '{"name":"Leo Garcia","email":"leo@example.com","message":"Dashboard looks amazing"}', CAST(strftime('%s', 'now', '-19 days', 'start of day', '+4 hours') AS INTEGER) * 1000);

-- Day 4 (18 days ago) - 5 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-4-1', 'test-form-1', '{"name":"Mia Rodriguez","email":"mia@example.com","message":"Mobile app coming soon?"}', CAST(strftime('%s', 'now', '-18 days', 'start of day') AS INTEGER) * 1000),
('sub-4-2', 'test-form-1', '{"name":"Noah Thomas","email":"noah@example.com","message":"Feature request submitted"}', CAST(strftime('%s', 'now', '-18 days', 'start of day', '+2 hours') AS INTEGER) * 1000),
('sub-4-3', 'test-form-1', '{"name":"Olivia Jackson","email":"olivia@example.com","message":"Thank you!"}', CAST(strftime('%s', 'now', '-18 days', 'start of day', '+5 hours') AS INTEGER) * 1000),
('sub-4-4', 'test-form-1', '{"name":"Paul White","email":"paul@example.com","message":"Bug in the form validation"}', CAST(strftime('%s', 'now', '-18 days', 'start of day', '+8 hours') AS INTEGER) * 1000),
('sub-4-5', 'test-form-1', '{"name":"Quinn Harris","email":"quinn@example.com","message":"Works perfectly now"}', CAST(strftime('%s', 'now', '-18 days', 'start of day', '+11 hours') AS INTEGER) * 1000);

-- Day 5 (17 days ago) - 0 submissions

-- Day 6 (16 days ago) - 8 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-6-1', 'test-form-1', '{"name":"Rachel Clark","email":"rachel@example.com","message":"Setup was easy!"}', CAST(strftime('%s', 'now', '-16 days', 'start of day') AS INTEGER) * 1000),
('sub-6-2', 'test-form-1', '{"name":"Sam Lewis","email":"sam@example.com","message":"Documentation is clear"}', CAST(strftime('%s', 'now', '-16 days', 'start of day', '+2 hours') AS INTEGER) * 1000),
('sub-6-3', 'test-form-1', '{"name":"Tina Walker","email":"tina@example.com","message":"Pricing question"}', CAST(strftime('%s', 'now', '-16 days', 'start of day', '+4 hours') AS INTEGER) * 1000),
('sub-6-4', 'test-form-1', '{"name":"Uma Hall","email":"uma@example.com","message":"Integration worked!"}', CAST(strftime('%s', 'now', '-16 days', 'start of day', '+6 hours') AS INTEGER) * 1000),
('sub-6-5', 'test-form-1', '{"name":"Victor Allen","email":"victor@example.com","message":"Need custom domain"}', CAST(strftime('%s', 'now', '-16 days', 'start of day', '+9 hours') AS INTEGER) * 1000),
('sub-6-6', 'test-form-1', '{"name":"Wendy Young","email":"wendy@example.com","message":"Great support team"}', CAST(strftime('%s', 'now', '-16 days', 'start of day', '+12 hours') AS INTEGER) * 1000),
('sub-6-7', 'test-form-1', '{"name":"Xavier King","email":"xavier@example.com","message":"Feature works as expected"}', CAST(strftime('%s', 'now', '-16 days', 'start of day', '+15 hours') AS INTEGER) * 1000),
('sub-6-8', 'test-form-1', '{"name":"Yara Wright","email":"yara@example.com","message":"Quick response time"}', CAST(strftime('%s', 'now', '-16 days', 'start of day', '+18 hours') AS INTEGER) * 1000);

-- Day 7 (15 days ago) - 4 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-7-1', 'test-form-1', '{"name":"Zack Scott","email":"zack@example.com","message":"Everything works great"}', CAST(strftime('%s', 'now', '-15 days', 'start of day') AS INTEGER) * 1000),
('sub-7-2', 'test-form-1', '{"name":"Amy Green","email":"amy@example.com","message":"Will recommend to others"}', CAST(strftime('%s', 'now', '-15 days', 'start of day', '+3 hours') AS INTEGER) * 1000),
('sub-7-3', 'test-form-1', '{"name":"Ben Adams","email":"ben@example.com","message":"API is well designed"}', CAST(strftime('%s', 'now', '-15 days', 'start of day', '+7 hours') AS INTEGER) * 1000),
('sub-7-4', 'test-form-1', '{"name":"Chloe Baker","email":"chloe@example.com","message":"Thank you for your help!"}', CAST(strftime('%s', 'now', '-15 days', 'start of day', '+11 hours') AS INTEGER) * 1000);

-- Day 8 (14 days ago) - 6 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-8-1', 'test-form-1', '{"name":"Dan Nelson","email":"dan@example.com","message":"Cloudflare integration?"}', CAST(strftime('%s', 'now', '-14 days', 'start of day') AS INTEGER) * 1000),
('sub-8-2', 'test-form-1', '{"name":"Ella Carter","email":"ella@example.com","message":"Perfect for my needs"}', CAST(strftime('%s', 'now', '-14 days', 'start of day', '+2 hours') AS INTEGER) * 1000),
('sub-8-3', 'test-form-1', '{"name":"Finn Mitchell","email":"finn@example.com","message":"Deployment was smooth"}', CAST(strftime('%s', 'now', '-14 days', 'start of day', '+5 hours') AS INTEGER) * 1000),
('sub-8-4', 'test-form-1', '{"name":"Gina Perez","email":"gina@example.com","message":"Love the simplicity"}', CAST(strftime('%s', 'now', '-14 days', 'start of day', '+8 hours') AS INTEGER) * 1000),
('sub-8-5', 'test-form-1', '{"name":"Hugo Roberts","email":"hugo@example.com","message":"Dashboard is intuitive"}', CAST(strftime('%s', 'now', '-14 days', 'start of day', '+12 hours') AS INTEGER) * 1000),
('sub-8-6', 'test-form-1', '{"name":"Ivy Turner","email":"ivy@example.com","message":"Works on mobile too"}', CAST(strftime('%s', 'now', '-14 days', 'start of day', '+16 hours') AS INTEGER) * 1000);

-- Day 9 (13 days ago) - 1 submission
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-9-1', 'test-form-1', '{"name":"Jake Phillips","email":"jake@example.com","message":"Quick question about limits"}', CAST(strftime('%s', 'now', '-13 days', 'start of day') AS INTEGER) * 1000);

-- Day 10 (12 days ago) - 9 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-10-1', 'test-form-1', '{"name":"Kelly Campbell","email":"kelly@example.com","message":"Excellent service"}', CAST(strftime('%s', 'now', '-12 days', 'start of day') AS INTEGER) * 1000),
('sub-10-2', 'test-form-1', '{"name":"Liam Parker","email":"liam@example.com","message":"Fast and reliable"}', CAST(strftime('%s', 'now', '-12 days', 'start of day', '+2 hours') AS INTEGER) * 1000),
('sub-10-3', 'test-form-1', '{"name":"Maya Evans","email":"maya@example.com","message":"Works perfectly"}', CAST(strftime('%s', 'now', '-12 days', 'start of day', '+4 hours') AS INTEGER) * 1000),
('sub-10-4', 'test-form-1', '{"name":"Nick Edwards","email":"nick@example.com","message":"Easy to integrate"}', CAST(strftime('%s', 'now', '-12 days', 'start of day', '+6 hours') AS INTEGER) * 1000),
('sub-10-5', 'test-form-1', '{"name":"Olive Collins","email":"olive@example.com","message":"Great documentation"}', CAST(strftime('%s', 'now', '-12 days', 'start of day', '+8 hours') AS INTEGER) * 1000),
('sub-10-6', 'test-form-1', '{"name":"Peter Stewart","email":"peter@example.com","message":"No issues so far"}', CAST(strftime('%s', 'now', '-12 days', 'start of day', '+10 hours') AS INTEGER) * 1000),
('sub-10-7', 'test-form-1', '{"name":"Quincy Morris","email":"quincy@example.com","message":"Highly recommended"}', CAST(strftime('%s', 'now', '-12 days', 'start of day', '+12 hours') AS INTEGER) * 1000),
('sub-10-8', 'test-form-1', '{"name":"Rose Rogers","email":"rose@example.com","message":"Support was helpful"}', CAST(strftime('%s', 'now', '-12 days', 'start of day', '+15 hours') AS INTEGER) * 1000),
('sub-10-9', 'test-form-1', '{"name":"Steve Reed","email":"steve@example.com","message":"Deployment guide clear"}', CAST(strftime('%s', 'now', '-12 days', 'start of day', '+18 hours') AS INTEGER) * 1000);

-- Day 11 (11 days ago) - 3 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-11-1', 'test-form-1', '{"name":"Tara Cook","email":"tara@example.com","message":"Works as advertised"}', CAST(strftime('%s', 'now', '-11 days', 'start of day') AS INTEGER) * 1000),
('sub-11-2', 'test-form-1', '{"name":"Uri Morgan","email":"uri@example.com","message":"Clean interface"}', CAST(strftime('%s', 'now', '-11 days', 'start of day', '+4 hours') AS INTEGER) * 1000),
('sub-11-3', 'test-form-1', '{"name":"Vera Bell","email":"vera@example.com","message":"Setup was quick"}', CAST(strftime('%s', 'now', '-11 days', 'start of day', '+8 hours') AS INTEGER) * 1000);

-- Day 12 (10 days ago) - 0 submissions

-- Day 13 (9 days ago) - 10 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-13-1', 'test-form-1', '{"name":"Will Murphy","email":"will@example.com","message":"Amazing product!"}', CAST(strftime('%s', 'now', '-9 days', 'start of day') AS INTEGER) * 1000),
('sub-13-2', 'test-form-1', '{"name":"Xena Bailey","email":"xena@example.com","message":"Just what I needed"}', CAST(strftime('%s', 'now', '-9 days', 'start of day', '+2 hours') AS INTEGER) * 1000),
('sub-13-3', 'test-form-1', '{"name":"Yuri Rivera","email":"yuri@example.com","message":"No complaints"}', CAST(strftime('%s', 'now', '-9 days', 'start of day', '+4 hours') AS INTEGER) * 1000),
('sub-13-4', 'test-form-1', '{"name":"Zoe Cooper","email":"zoe@example.com","message":"Will use again"}', CAST(strftime('%s', 'now', '-9 days', 'start of day', '+6 hours') AS INTEGER) * 1000),
('sub-13-5', 'test-form-1', '{"name":"Adam Richardson","email":"adam@example.com","message":"Five stars"}', CAST(strftime('%s', 'now', '-9 days', 'start of day', '+8 hours') AS INTEGER) * 1000),
('sub-13-6', 'test-form-1', '{"name":"Beth Cox","email":"beth@example.com","message":"Exactly what promised"}', CAST(strftime('%s', 'now', '-9 days', 'start of day', '+10 hours') AS INTEGER) * 1000),
('sub-13-7', 'test-form-1', '{"name":"Carl Howard","email":"carl@example.com","message":"Simple and effective"}', CAST(strftime('%s', 'now', '-9 days', 'start of day', '+12 hours') AS INTEGER) * 1000),
('sub-13-8', 'test-form-1', '{"name":"Dana Ward","email":"dana@example.com","message":"Works great"}', CAST(strftime('%s', 'now', '-9 days', 'start of day', '+14 hours') AS INTEGER) * 1000),
('sub-13-9', 'test-form-1', '{"name":"Eric Torres","email":"eric@example.com","message":"Best form backend"}', CAST(strftime('%s', 'now', '-9 days', 'start of day', '+16 hours') AS INTEGER) * 1000),
('sub-13-10', 'test-form-1', '{"name":"Faye Peterson","email":"faye@example.com","message":"Love the API"}', CAST(strftime('%s', 'now', '-9 days', 'start of day', '+19 hours') AS INTEGER) * 1000);

-- Day 14 (8 days ago) - 5 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-14-1', 'test-form-1', '{"name":"Gary Gray","email":"gary@example.com","message":"Smooth experience"}', CAST(strftime('%s', 'now', '-8 days', 'start of day') AS INTEGER) * 1000),
('sub-14-2', 'test-form-1', '{"name":"Hana Ramirez","email":"hana@example.com","message":"Support responded fast"}', CAST(strftime('%s', 'now', '-8 days', 'start of day', '+3 hours') AS INTEGER) * 1000),
('sub-14-3', 'test-form-1', '{"name":"Ian James","email":"ian@example.com","message":"Clean code"}', CAST(strftime('%s', 'now', '-8 days', 'start of day', '+6 hours') AS INTEGER) * 1000),
('sub-14-4', 'test-form-1', '{"name":"Jade Watson","email":"jade@example.com","message":"No bugs found"}', CAST(strftime('%s', 'now', '-8 days', 'start of day', '+10 hours') AS INTEGER) * 1000),
('sub-14-5', 'test-form-1', '{"name":"Kyle Brooks","email":"kyle@example.com","message":"Works on all devices"}', CAST(strftime('%s', 'now', '-8 days', 'start of day', '+14 hours') AS INTEGER) * 1000);

-- Day 15 (7 days ago) - 4 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-15-1', 'test-form-1', '{"name":"Lara Kelly","email":"lara@example.com","message":"Easy setup process"}', CAST(strftime('%s', 'now', '-7 days', 'start of day') AS INTEGER) * 1000),
('sub-15-2', 'test-form-1', '{"name":"Mark Sanders","email":"mark@example.com","message":"Great for startups"}', CAST(strftime('%s', 'now', '-7 days', 'start of day', '+4 hours') AS INTEGER) * 1000),
('sub-15-3', 'test-form-1', '{"name":"Nina Price","email":"nina@example.com","message":"Professional service"}', CAST(strftime('%s', 'now', '-7 days', 'start of day', '+9 hours') AS INTEGER) * 1000),
('sub-15-4', 'test-form-1', '{"name":"Owen Bennett","email":"owen@example.com","message":"Exceeded expectations"}', CAST(strftime('%s', 'now', '-7 days', 'start of day', '+14 hours') AS INTEGER) * 1000);

-- Day 16 (6 days ago) - 7 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-16-1', 'test-form-1', '{"name":"Pam Wood","email":"pam@example.com","message":"Reliable service"}', CAST(strftime('%s', 'now', '-6 days', 'start of day') AS INTEGER) * 1000),
('sub-16-2', 'test-form-1', '{"name":"Quin Barnes","email":"quin@example.com","message":"Works perfectly"}', CAST(strftime('%s', 'now', '-6 days', 'start of day', '+2 hours') AS INTEGER) * 1000),
('sub-16-3', 'test-form-1', '{"name":"Rita Ross","email":"rita@example.com","message":"Clean UI"}', CAST(strftime('%s', 'now', '-6 days', 'start of day', '+5 hours') AS INTEGER) * 1000),
('sub-16-4', 'test-form-1', '{"name":"Seth Henderson","email":"seth@example.com","message":"Fast performance"}', CAST(strftime('%s', 'now', '-6 days', 'start of day', '+8 hours') AS INTEGER) * 1000),
('sub-16-5', 'test-form-1', '{"name":"Tess Coleman","email":"tess@example.com","message":"Great experience"}', CAST(strftime('%s', 'now', '-6 days', 'start of day', '+11 hours') AS INTEGER) * 1000),
('sub-16-6', 'test-form-1', '{"name":"Umar Jenkins","email":"umar@example.com","message":"Highly satisfied"}', CAST(strftime('%s', 'now', '-6 days', 'start of day', '+14 hours') AS INTEGER) * 1000),
('sub-16-7', 'test-form-1', '{"name":"Vicky Perry","email":"vicky@example.com","message":"Will continue using"}', CAST(strftime('%s', 'now', '-6 days', 'start of day', '+17 hours') AS INTEGER) * 1000);

-- Day 17 (5 days ago) - 2 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-17-1', 'test-form-1', '{"name":"Wade Powell","email":"wade@example.com","message":"Simple integration"}', CAST(strftime('%s', 'now', '-5 days', 'start of day') AS INTEGER) * 1000),
('sub-17-2', 'test-form-1', '{"name":"Xara Long","email":"xara@example.com","message":"Works as expected"}', CAST(strftime('%s', 'now', '-5 days', 'start of day', '+5 hours') AS INTEGER) * 1000);

-- Day 18 (4 days ago) - 6 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-18-1', 'test-form-1', '{"name":"Yale Patterson","email":"yale@example.com","message":"Good value"}', CAST(strftime('%s', 'now', '-4 days', 'start of day') AS INTEGER) * 1000),
('sub-18-2', 'test-form-1', '{"name":"Zara Hughes","email":"zara@example.com","message":"No issues"}', CAST(strftime('%s', 'now', '-4 days', 'start of day', '+2 hours') AS INTEGER) * 1000),
('sub-18-3', 'test-form-1', '{"name":"Andy Flores","email":"andy@example.com","message":"Solid product"}', CAST(strftime('%s', 'now', '-4 days', 'start of day', '+5 hours') AS INTEGER) * 1000),
('sub-18-4', 'test-form-1', '{"name":"Bree Washington","email":"bree@example.com","message":"Easy to use"}', CAST(strftime('%s', 'now', '-4 days', 'start of day', '+8 hours') AS INTEGER) * 1000),
('sub-18-5', 'test-form-1', '{"name":"Cole Butler","email":"cole@example.com","message":"Works well"}', CAST(strftime('%s', 'now', '-4 days', 'start of day', '+12 hours') AS INTEGER) * 1000),
('sub-18-6', 'test-form-1', '{"name":"Dara Simmons","email":"dara@example.com","message":"Happy customer"}', CAST(strftime('%s', 'now', '-4 days', 'start of day', '+16 hours') AS INTEGER) * 1000);

-- Day 19 (3 days ago) - 8 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-19-1', 'test-form-1', '{"name":"Earl Foster","email":"earl@example.com","message":"Recommended"}', CAST(strftime('%s', 'now', '-3 days', 'start of day') AS INTEGER) * 1000),
('sub-19-2', 'test-form-1', '{"name":"Fern Gonzales","email":"fern@example.com","message":"Great tool"}', CAST(strftime('%s', 'now', '-3 days', 'start of day', '+2 hours') AS INTEGER) * 1000),
('sub-19-3', 'test-form-1', '{"name":"Glen Bryant","email":"glen@example.com","message":"No problems"}', CAST(strftime('%s', 'now', '-3 days', 'start of day', '+4 hours') AS INTEGER) * 1000),
('sub-19-4', 'test-form-1', '{"name":"Hope Alexander","email":"hope@example.com","message":"Works great"}', CAST(strftime('%s', 'now', '-3 days', 'start of day', '+7 hours') AS INTEGER) * 1000),
('sub-19-5', 'test-form-1', '{"name":"Ivan Russell","email":"ivan@example.com","message":"Clean design"}', CAST(strftime('%s', 'now', '-3 days', 'start of day', '+10 hours') AS INTEGER) * 1000),
('sub-19-6', 'test-form-1', '{"name":"Jess Griffin","email":"jess@example.com","message":"Fast setup"}', CAST(strftime('%s', 'now', '-3 days', 'start of day', '+13 hours') AS INTEGER) * 1000),
('sub-19-7', 'test-form-1', '{"name":"Kurt Diaz","email":"kurt@example.com","message":"Excellent"}', CAST(strftime('%s', 'now', '-3 days', 'start of day', '+16 hours') AS INTEGER) * 1000),
('sub-19-8', 'test-form-1', '{"name":"Lisa Hayes","email":"lisa@example.com","message":"Perfect"}', CAST(strftime('%s', 'now', '-3 days', 'start of day', '+19 hours') AS INTEGER) * 1000);

-- Day 20 (2 days ago) - 3 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-20-1', 'test-form-1', '{"name":"Mike Myers","email":"mike@example.com","message":"Great service"}', CAST(strftime('%s', 'now', '-2 days', 'start of day') AS INTEGER) * 1000),
('sub-20-2', 'test-form-1', '{"name":"Nora Ford","email":"nora@example.com","message":"Works well"}', CAST(strftime('%s', 'now', '-2 days', 'start of day', '+5 hours') AS INTEGER) * 1000),
('sub-20-3', 'test-form-1', '{"name":"Otto Hamilton","email":"otto@example.com","message":"No complaints"}', CAST(strftime('%s', 'now', '-2 days', 'start of day', '+10 hours') AS INTEGER) * 1000);

-- Day 21 (1 day ago) - 5 submissions
INSERT INTO submissions (id, form_id, data, created_at) VALUES
('sub-21-1', 'test-form-1', '{"name":"Peta Castillo","email":"peta@example.com","message":"Easy integration"}', CAST(strftime('%s', 'now', '-1 days', 'start of day') AS INTEGER) * 1000),
('sub-21-2', 'test-form-1', '{"name":"Quin Freeman","email":"quin@example.com","message":"Works perfectly"}', CAST(strftime('%s', 'now', '-1 days', 'start of day', '+3 hours') AS INTEGER) * 1000),
('sub-21-3', 'test-form-1', '{"name":"Remy Hawkins","email":"remy@example.com","message":"Good support"}', CAST(strftime('%s', 'now', '-1 days', 'start of day', '+7 hours') AS INTEGER) * 1000),
('sub-21-4', 'test-form-1', '{"name":"Sage Palmer","email":"sage@example.com","message":"Recommended"}', CAST(strftime('%s', 'now', '-1 days', 'start of day', '+11 hours') AS INTEGER) * 1000),
('sub-21-5', 'test-form-1', '{"name":"Troy Robertson","email":"troy@example.com","message":"Five stars"}', CAST(strftime('%s', 'now', '-1 days', 'start of day', '+16 hours') AS INTEGER) * 1000);
