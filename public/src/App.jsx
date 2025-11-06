import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import {AuthProvider} from "@/lib/AuthContext"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import PatientDashboard from "./pages/pacientes/dashboard_paciente"
import LoginPage from "@/login"
import NotFound from "@/pages/NotFound"
import AppointmentBooking from "@/pages/pacientes/citas"
import MyAppointmentsPage from "@/pages/pacientes/mis-citas"
import HistoriaClinicaPage from "@/pages/pacientes/historial"
import ChatbotPage from "./pages/pacientes/chatbot"
import PatientTreatmentPage from "./pages/pacientes/tratamientos"
import GameteDonation from "./pages/pacientes/donacion"
import AgendaPage from "./pages/medico/agenda"
import DoctorDashboard from "./pages/medico/dashboard_medico"
import StudiesRequestPage from "./pages/medico/estudios"
import ClinicalHistoryPage from "@/pages/medico/historial-clinica"
import RegistrarPaciente from "./registrar"
import PacientesPage from "./pages/medico/pacientes"
import PacienteDetail from "./pages/medico/paciente"
import { ThemeProvider } from "./lib/ThemeContex"
function App() {
    return (
        <ThemeProvider>
            <AuthProvider>    
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/registrar" element={<RegistrarPaciente />} />
                       
                        {/* Prefijo único para paciente */}
                        <Route
                            path="/paciente"
                            element={
                                    <Outlet />
                            }
                        >
                            <Route index element={<PatientDashboard />} />
                            <Route path="citas" element={<AppointmentBooking />} />
                            <Route path="mis-citas" element={<MyAppointmentsPage />} />
                            <Route path="historia" element={<HistoriaClinicaPage />} />
                            <Route path="chatbot" element={<ChatbotPage />} />
                            <Route path="tratamiento" element={<PatientTreatmentPage />} />
                            <Route path="donacion" element={<GameteDonation />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                        <Route path="/medico" element={
                                <Outlet />
                        }>
                            <Route path="pacientes" element={ <Outlet />} >
                                <Route index element={<PacientesPage />} />
                                <Route path=":id" element={<PacienteDetail />} />
                            </Route>
                            <Route index element={<DoctorDashboard />} />
                            <Route path="agenda" element={<AgendaPage />} />
                            <Route path="historia-clinica" element={<ClinicalHistoryPage />} />
                            <Route path="estudios" element={<StudiesRequestPage />} />
                        </Route>

                        <Route path="*" element={<NotFound />} />
                    </Routes>                
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    )
}
      
export default App