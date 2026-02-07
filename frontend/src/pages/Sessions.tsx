import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SessionList from "../components/session/SessionList";
import ChatBoard from "../components/session/ChatBoard";
import TopNavigationBar from "../components/layout/TopNavigationBar";
import { getSessionBoardsByLearner, getSessionBoardsByTeacher } from "../services/sessionService";
import { SessionBoard } from "../types/session.types";
import { getProfileById } from "../services/profileService";
import ProfileDropdown from "../components/dashboard/ProfileDropdown";

const Sessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionBoard[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // 1. Initialize User & Fetch Sessions
  useEffect(() => {
    const init = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      setCurrentUserId(userId);

      try {
        // Need to determine if user is learner or teacher or both.
        // Backend has separate endpoints. A user could be both.
        // We'll fetch both and combine/deduplicate.

        // However, we don't know the ROLE easily without fetching profile or storing it.
        // Let's assume we fetch both lists since a user can be both a seeker and provider.

        const [learnerSessions, teacherSessions] = await Promise.all([
          getSessionBoardsByLearner(userId).catch(() => []),
          getSessionBoardsByTeacher(userId).catch(() => [])
        ]);

        // Merge arrays (handling potential duplicates if backend logic overlaps, though likely distinct)
        // Using Map to unique by ID
        const sessionMap = new Map<string, SessionBoard>();
        learnerSessions.forEach(s => sessionMap.set(s.id, s));
        teacherSessions.forEach(s => sessionMap.set(s.id, s));

        const allSessions = Array.from(sessionMap.values());

        // Sort by last message or created date desc
        allSessions.sort((a, b) => {
          const timeA = new Date(a.lastMessageAt || a.createdAt || 0).getTime();
          const timeB = new Date(b.lastMessageAt || b.createdAt || 0).getTime();
          return timeB - timeA;
        });

        setSessions(allSessions);

        // Auto-select first session if basic navigation
        // if (allSessions.length > 0 && !selectedSessionId) {
        //   setSelectedSessionId(allSessions[0].id);
        // }

      } catch (err) {
        console.error("Failed to fetch sessions", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  const handleSessionUpdate = async () => {
    // Re-fetch sessions to update order/preview
    // Simplified re-fetch logic duplicating init
    if (!currentUserId) return;

    try {
      const [learnerSessions, teacherSessions] = await Promise.all([
        getSessionBoardsByLearner(currentUserId).catch(() => []),
        getSessionBoardsByTeacher(currentUserId).catch(() => [])
      ]);

      const sessionMap = new Map<string, SessionBoard>();
      learnerSessions.forEach(s => sessionMap.set(s.id, s));
      teacherSessions.forEach(s => sessionMap.set(s.id, s));

      const allSessions = Array.from(sessionMap.values());

      allSessions.sort((a, b) => {
        const timeA = new Date(a.lastMessageAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.lastMessageAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      setSessions(allSessions);
    } catch (err) {
      console.error(err);
    }
  };

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading sessions...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      <TopNavigationBar
        active="sessions"
        onProfileClick={() => setShowProfileMenu(prev => !prev)}
      />
      {showProfileMenu && (
        <ProfileDropdown onClose={() => setShowProfileMenu(false)} />
      )}
      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT SIDEBAR: Session List */}
        <SessionList
          sessions={sessions}
          selectedSessionId={selectedSessionId}
          currentUserId={currentUserId}
          onSelectSession={setSelectedSessionId}
          onRefresh={handleSessionUpdate}
        />

        {/* RIGHT MAIN: Chat Board */}
        {selectedSession ? (
          <ChatBoard
            session={selectedSession}
            currentUserId={currentUserId}
            onSessionUpdate={handleSessionUpdate}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-transparent text-gray-500">
            <img
              src="/src/assets/images/skilllink-logo.png"
              className="h-24 opacity-20 mb-4 grayscale"
              alt="Logo"
            />
            <p>Select a session to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;
