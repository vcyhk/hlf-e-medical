import { Navigate, Outlet } from 'react-router-dom';
import Login from '../views/Login';
import Register from '../views/Register';
import RegisterDoctor from '../views/RegisterDoctor';
import RegisterPatient from '../views/RegisterPatient';
import Dashboard from '../views/Dashboard';
import Booking from '../views/Booking';
import MakeAppointment from '../views/MakeAppointment';
import FindHospital from '../views/FindHospital';
import FindDepartment from '../views/FindDepartment';
import FindDoctor from '../views/FindDoctor';
import DoctorDetails from '../views/DoctorDetails';
import Appointments from '../views/Appointments';
import Mailbox from '../views/Mailbox';
import MailboxDetails from '../views/MailboxDetails';
import Information from '../views/Information';
import Settings from '../views/Settings';
import Reward from '../views/Reward';
import ForgotPassword from '../views/ForgotPassword';
import PasswordReset from '../views/PasswordReset';
import AppointmentDetails from '../views/AppointmentDetails';


const routes = (isLoggedIn) => [
    {
        path: '/app',
        element: isLoggedIn ? <Outlet /> : <Navigate to="/login" />,
        children: [
            {index: true, element: <Navigate to="/app/dashboard" />},
            {path: 'dashboard', element: <Dashboard />},
            {path: 'dashboard/booking', element: <Booking />},
            {path: 'dashboard/booking/new', element: <MakeAppointment />},
            {path: 'dashboard/booking/appointments', element: <Appointments />},
            {path: 'dashboard/booking/appointments/:id', element: <AppointmentDetails />},
            {path: 'dashboard/information', element: <Information />},
            {path: 'dashboard/hospitals', element: <FindHospital />},
            {path: 'dashboard/hospitals/:id/departments', element: <FindDepartment />},
            {path: 'dashboard/hospitals/:h_id/departments/:d_id/doctors', element: <FindDoctor />},
            {path: 'dashboard/hospitals/:h_id/departments/:d_id/doctors/:dc_id', element: <DoctorDetails />},
            {path: 'dashboard/Mailbox', element: <Mailbox />},
            {path: 'dashboard/mailbox/:id', element: <MailboxDetails />},
            {path: 'dashboard/settings', element: <Settings />},
            {path: 'dashboard/reward', element: <Reward />}
        ]
    }, 
    {
        path: '/',
        element: !isLoggedIn ? <Outlet /> : <Navigate to="/app/dashboard" />,
        children: [
            {index: true, element: <Navigate to="/login" />},
            {path: 'login', element: <Login />},
            {path: 'register', element: <Register />},
            {path: 'register/patient', element: <RegisterPatient />},
            {path: 'register/doctor', element: <RegisterDoctor />},
            {path: 'forgot', element: <ForgotPassword />},
            {path: 'passwordreset/:token', element: <PasswordReset />}
        ]
    }

];

export default routes;