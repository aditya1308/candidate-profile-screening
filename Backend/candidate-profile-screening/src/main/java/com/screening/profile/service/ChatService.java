package com.screening.profile.service;


import com.screening.profile.dto.ChatResponseDTO;
import com.screening.profile.model.Candidate;
import com.screening.profile.model.Job;
import com.screening.profile.model.JobApplication;
import com.screening.profile.service.candidate.CandidateService;
import com.screening.profile.service.job.JobService;
import com.screening.profile.service.jobapplication.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final CandidateService candidateService;
    private final JobApplicationService jobApplicationService;
    private final JobService jobService;

    public ChatResponseDTO processUserMessage(String message) {
        String userMessage = message.trim().toLowerCase();
        String reply="";
        String email;
        List<Candidate> listOfCandidates;

        if(userMessage.startsWith("status")){
            email= Arrays.stream(userMessage.split(" ")).toArray()[1].toString();
            userMessage= "status";
            listOfCandidates= candidateService.getCandidatesByEmail(email);
            if(listOfCandidates== null){
                reply= "Looks like you haven’t applied for any jobs yet.";
            }
            else{
                reply = "Your application status for the following job applications:";
                for(Candidate c: listOfCandidates){
                    JobApplication jobApplication= jobApplicationService.getApplicationsByCandidate(c.getId()).get(0);
                    Job job= jobService.getJob(jobApplication.getJob().getId()).get();
                    String subReply= "\n Job Title:"+ job.getTitle()+ "\n Status:"+ c.getStatus();
                    reply+= subReply;
                }
            }
        }


        switch (userMessage) {
            case "1":
                reply = "Please provide your email id to check the status of your applied job applications. In the following format: STATUS EMAIL_ID";
                break;

            case "status":
                break;

            case "2":
                String availableJobs= "http://localhost:8092/api/v1/jobs";
                reply = "Available Jobs: " + availableJobs;
                break;

            case "3":
                String aboutUs= "http://localhost:5174/about";
                reply = "Please visit "+ aboutUs;
                break;

            case "4":
                String contactUs = "http://localhost:5174/contact";
                reply = "Please visit " + contactUs;
                break;

            case "5":
                reply= "Thank you! Have a nice day ahead.";
                break;

            default:
                reply = "Hi! Please select an option:\n" +
                        "1. Check Your Job Application Status\n" +
                        "2. View Available Jobs\n" +
                        "3. About Us\n" +
                        "4. Contact Us\n"+
                        "5. Exit"
                ;
        }

        return new ChatResponseDTO(reply);
    }
}
