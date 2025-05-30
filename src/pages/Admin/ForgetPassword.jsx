import React from 'react'
import { forgetPassword } from '../../services/api'
import { useAuth } from '../../auth/AuthContext';


const ForgetPassword = () => {
    const user = useAuth();

    

    return (
        <div>ForgetPassword</div>
    )
}

export default ForgetPassword