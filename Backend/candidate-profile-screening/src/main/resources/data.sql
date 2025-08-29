-- HR Users (20)
INSERT IGNORE INTO authorizedaccess (email, role) VALUES
('anita.sharma@socgen.com', 'HR'),
('rahul.verma@socgen.com', 'HR'),
('sneha.rao@socgen.com', 'HR'),
('priyanka.mehta@socgen.com', 'HR'),
('vikas.kapoor@socgen.com', 'HR'),
('deepak.nair@socgen.com', 'HR'),
('swati.agrawal@socgen.com', 'HR'),
('kiran.menon@socgen.com', 'HR'),
('arjun.mishra@socgen.com', 'HR'),
('pallavi.jain@socgen.com', 'HR'),
('sunita.patel@socgen.com', 'HR'),
('alok.banerjee@socgen.com', 'HR'),
('manish.kumar@socgen.com', 'HR'),
('neha.gupta@socgen.com', 'HR'),
('shweta.singh@socgen.com', 'HR'),
('ravi.desai@socgen.com', 'HR'),
('pooja.chopra@socgen.com', 'HR'),
('amit.sarkar@socgen.com', 'HR'),
('divya.iyer@socgen.com', 'HR'),
('saurabh.joshi@socgen.com', 'HR');

-- INTERVIEWER Users (30)
INSERT IGNORE INTO authorizedaccess (email, role) VALUES
('mukesh.yadav@socgen.com', 'INTERVIEWER'),
('geeta.reddy@socgen.com', 'INTERVIEWER'),
('rajat.khanna@socgen.com', 'INTERVIEWER'),
('ankita.pandey@socgen.com', 'INTERVIEWER'),
('suresh.kumar@socgen.com', 'INTERVIEWER'),
('meena.pillai@socgen.com', 'INTERVIEWER'),
('naveen.shetty@socgen.com', 'INTERVIEWER'),
('rekha.bhatt@socgen.com', 'INTERVIEWER'),
('ajay.garg@socgen.com', 'INTERVIEWER'),
('sonal.trivedi@socgen.com', 'INTERVIEWER'),
('harish.shah@socgen.com', 'INTERVIEWER'),
('jyoti.bose@socgen.com', 'INTERVIEWER'),
('ganesh.patil@socgen.com', 'INTERVIEWER'),
('pradeep.rana@socgen.com', 'INTERVIEWER'),
('monika.arora@socgen.com', 'INTERVIEWER'),
('ashok.malhotra@socgen.com', 'INTERVIEWER'),
('ruchi.kohli@socgen.com', 'INTERVIEWER'),
('tarun.gupta@socgen.com', 'INTERVIEWER'),
('seema.nair@socgen.com', 'INTERVIEWER'),
('vivek.saxena@socgen.com', 'INTERVIEWER'),
('alka.choudhary@socgen.com', 'INTERVIEWER'),
('manoj.varma@socgen.com', 'INTERVIEWER'),
('nandita.sinha@socgen.com', 'INTERVIEWER'),
('girish.jain@socgen.com', 'INTERVIEWER'),
('tanya.agarwal@socgen.com', 'INTERVIEWER'),
('rohit.mahajan@socgen.com', 'INTERVIEWER'),
('kavita.sharma@socgen.com', 'INTERVIEWER'),
('sanjay.thakur@socgen.com', 'INTERVIEWER'),
('usha.iyer@socgen.com', 'INTERVIEWER'),
('dinesh.chauhan@socgen.com', 'INTERVIEWER');

-- SuperADMIN
INSERT IGNORE INTO admin (email, password, full_name, phone_number, role) VALUES
('super.admin@socgen.com', '$2a$10$7dJwZsGpQ6uQh9nbJgTj7uJ1JXcGJ4y0N4XjKk3rQXjU6QwF8q5gq', 'Super Admin', '9123456789', 'SUPERADMIN');

