import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { interviewerService } from '../services/interviewerService';

const InterviewerSelectionScreen = ({ 
  candidate, 
  onBack, 
  onConfirm, 
  currentRound, 
  nextRound 
}) => {
  const [interviewers, setInterviewers] = useState([]);
  const [filteredInterviewers, setFilteredInterviewers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInterviewers();
  }, []);

  const fetchInterviewers = async () => {
    try {
      setLoading(true);
      const data = await interviewerService.getAllInterviewers();
      if (data) {
        setInterviewers(data);
        setFilteredInterviewers(data);
      } else {
        // Mock data if API fails
        const mockData = [
          { id: 1, fullName: "John Doe", email: "john.doe@company.com" },
          { id: 2, fullName: "Jane Smith", email: "jane.smith@company.com" },
          { id: 3, fullName: "Mike Johnson", email: "mike.johnson@company.com" },
          { id: 4, fullName: "Sarah Wilson", email: "sarah.wilson@company.com" },
          { id: 5, fullName: "David Brown", email: "david.brown@company.com" },
          { id: 6, fullName: "Emily Davis", email: "emily.davis@company.com" },
          { id: 7, fullName: "Robert Taylor", email: "robert.taylor@company.com" },
          { id: 8, fullName: "Lisa Anderson", email: "lisa.anderson@company.com" },
          { id: 9, fullName: "Michael Wilson", email: "michael.wilson@company.com" },
          { id: 10, fullName: "Jennifer Garcia", email: "jennifer.garcia@company.com" },
          { id: 11, fullName: "Christopher Martinez", email: "christopher.martinez@company.com" },
          { id: 12, fullName: "Amanda Rodriguez", email: "amanda.rodriguez@company.com" },
          { id: 13, fullName: "James Thompson", email: "james.thompson@company.com" },
          { id: 14, fullName: "Michelle White", email: "michelle.white@company.com" },
          { id: 15, fullName: "Daniel Lee", email: "daniel.lee@company.com" },
          { id: 16, fullName: "Jessica Hall", email: "jessica.hall@company.com" },
          { id: 17, fullName: "Matthew Allen", email: "matthew.allen@company.com" },
          { id: 18, fullName: "Nicole Young", email: "nicole.young@company.com" },
          { id: 19, fullName: "Andrew King", email: "andrew.king@company.com" },
          { id: 20, fullName: "Stephanie Wright", email: "stephanie.wright@company.com" }
        ];
        setInterviewers(mockData);
        setFilteredInterviewers(mockData);
      }
    } catch (err) {
      console.error('Error fetching interviewers:', err);
      // Use mock data on error
      const mockData = [
        { id: 1, fullName: "John Doe", email: "john.doe@company.com" },
        { id: 2, fullName: "Jane Smith", email: "jane.smith@company.com" },
        { id: 3, fullName: "Mike Johnson", email: "mike.johnson@company.com" },
        { id: 4, fullName: "Sarah Wilson", email: "sarah.wilson@company.com" },
        { id: 5, fullName: "David Brown", email: "david.brown@company.com" },
        { id: 6, fullName: "Emily Davis", email: "emily.davis@company.com" },
        { id: 7, fullName: "Robert Taylor", email: "robert.taylor@company.com" },
        { id: 8, fullName: "Lisa Anderson", email: "lisa.anderson@company.com" },
        { id: 9, fullName: "Michael Wilson", email: "michael.wilson@company.com" },
        { id: 10, fullName: "Jennifer Garcia", email: "jennifer.garcia@company.com" },
        { id: 11, fullName: "Christopher Martinez", email: "christopher.martinez@company.com" },
        { id: 12, fullName: "Amanda Rodriguez", email: "amanda.rodriguez@company.com" },
        { id: 13, fullName: "James Thompson", email: "james.thompson@company.com" },
        { id: 14, fullName: "Michelle White", email: "michelle.white@company.com" },
        { id: 15, fullName: "Daniel Lee", email: "daniel.lee@company.com" },
        { id: 16, fullName: "Jessica Hall", email: "jessica.hall@company.com" },
        { id: 17, fullName: "Matthew Allen", email: "matthew.allen@company.com" },
        { id: 18, fullName: "Nicole Young", email: "nicole.young@company.com" },
        { id: 19, fullName: "Andrew King", email: "andrew.king@company.com" },
        { id: 20, fullName: "Stephanie Wright", email: "stephanie.wright@company.com" }
      ];
      setInterviewers(mockData);
      setFilteredInterviewers(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Filter interviewers based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredInterviewers(interviewers);
    } else {
      const filtered = interviewers.filter(interviewer =>
        interviewer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interviewer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInterviewers(filtered);
    }
  }, [searchQuery, interviewers]);

  const handleInterviewerClick = (interviewer) => {
    onConfirm(interviewer);
  };

  const getRoundLabel = (round) => {
    switch (round) {
      case 'applied': return 'Applied';
      case 'round1': return 'Round 1';
      case 'round2': return 'Round 2';
      case 'round3': return 'Round 3';
      default: return round;
    }
  };

  return (
    <div className="overflow-hidden transition-all duration-500 ease-out bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Select Interviewer</h3>
            <p className="text-xs text-gray-600">
              {candidate.fullName} • {getRoundLabel(currentRound)} → {getRoundLabel(nextRound)}
            </p>
          </div>
        </div>
      </div>

             {/* Search */}
       <div className="p-3 border-b">
         <div className="relative">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                       <input
              type="text"
              placeholder="Search interviewers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded hover:border-2 hover:border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
         </div>
       </div>

      {/* Interviewers List */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="text-sm text-gray-500">Loading interviewers...</div>
          </div>
        ) : filteredInterviewers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-base text-gray-500 mb-1">
              {searchQuery ? 'No interviewers found' : 'No interviewers available'}
            </div>
            <div className="text-xs text-gray-400">
              {searchQuery ? `No interviewers match "${searchQuery}"` : 'There are no interviewers in the system yet.'}
            </div>
          </div>
        ) : (
                     <div className="p-3">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
               {filteredInterviewers.map((interviewer) => (
                 <div key={interviewer.id} className="relative group">
                                       {/* Shadow layer - positioned to the right and bottom with thick black shadow */}
                    <div 
                      className="absolute top-0 left-0 w-full h-full bg-black transition-all duration-200 group-hover:opacity-0"
                      style={{ transform: 'translate(4px, 4px)' }}
                    />
                    
                    {/* Card layer */}
                                         <div
                       onClick={() => handleInterviewerClick(interviewer)}
                       className="relative p-3 bg-white border-4 border-red-500 text-gray-900 cursor-pointer transition-all duration-200 transform group-hover:translate-x-1 group-hover:translate-y-1 hover:shadow-xl"
                     >
                                               <div className="text-sm flex justify-between items-center">
                          <span className="font-medium">{interviewer.fullName}</span>
                          <span className="text-xs text-gray-600">{interviewer.email}</span>
                        </div>
                     </div>
                 </div>
               ))}
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default InterviewerSelectionScreen;
