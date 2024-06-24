import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const withAuth = (allowedRoles) => (WrappedComponent) => {
  const WrapperComponent = (props) => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          // check for authentication
          const response = await axios.get(
            `${process.env.REACT_APP_URL}/check-auth`,
            { withCredentials: true }
          );
          // if it returns as true, there's an authenticated token
          if (response.data.status) {
            const userRole = response.data.role;
            // check for roles in the returned response
            if (allowedRoles.includes(userRole)) {
              setIsAuthorized(true)
            } else {
              if (userRole === "teacher") {
                navigate("/teacher-home");
              } else if (userRole === "student") {
                navigate("/student-home")
              } else {
                navigate("/login")
              }
              setIsAuthorized(false)
            }
          } else {
            // User is not authenticated
            navigate("/login")
            setIsAuthorized(false)
          }
        } catch (error) {
          console.error("Authentication error:", error);
          navigate("/login");
        }
      };

      checkAuth();
    }, [navigate]);

    if (isAuthorized === null) {
        // Show a loading state while checking authorization
        return <div>Loading...</div>;
      }
  
    if (isAuthorized) {
    // User is authorized
    return <WrappedComponent {...props} />;
    }
  };

  return WrapperComponent;
};

export default withAuth;
