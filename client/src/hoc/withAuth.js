import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const withAuth = (allowedRoles) => (WrappedComponent) => {

    const WrapperComponent = (props) => {
        const navigate = useNavigate()
    
        useEffect(() => {
           const checkAuth = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_URL}/check-auth`, { withCredentials: true })
                    if (response.data.status && allowedRoles.includes(response.data.role)) {
                        console.log("continue..")
                    } else {
                        console.log("cannot find token or user is not verified for this login")
                        navigate("/login")
                    }
                } catch (error) {
                    console.error('Authentication error:', error);
                    navigate('/login');
                }
           }

           checkAuth()
        }, [navigate])

        return <WrappedComponent {...props} />
    }

  return WrapperComponent
}

export default withAuth