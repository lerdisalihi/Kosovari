import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../lib/services/auth';
import { useIssueStore } from '../../store/issues';

export function Header() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { setReportingMode } = useIssueStore();

  const handleReportProblem = () => {
    setReportingMode(true);
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 
              onClick={() => navigate('/')} 
              className="text-xl font-bold text-green-600 cursor-pointer"
            >
              KosovAR
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Issues - visible to all users */}
            <button
              onClick={() => navigate('/issues')}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              View Issues
            </button>

            {user ? (
              <>
                <button
                  onClick={handleReportProblem}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Report Problem
                </button>

                {user.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Admin Dashboard
                  </button>
                )}

                <div className="px-3 py-1 bg-emerald-100 rounded-full">
                  <span className="text-sm text-emerald-700">Lvl{user.level}</span>
                </div>

                <span className="text-sm text-emerald-700">{user.email}</span>

                <button
                  onClick={() => {
                    signOut();
                    navigate('/');
                  }}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 