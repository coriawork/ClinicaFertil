import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import {AuthProvider} from "@/lib/AuthContext"
import PatientDashboard from "./pages/pacientes/dashboard_paciente"
import LoginPage from "@/login"
import NotFound from "@/pages/NotFound"
import AppointmentBooking from "@/pages/pacientes/citas"
import MyAppointmentsPage from "@/pages/pacientes/mis-citas"
import HistoriaClinicaPage from "@/pages/pacientes/historial"
import ChatbotPage from "./pages/pacientes/chatbot"
import GameteDonation from "./pages/pacientes/donacion"
import AgendaPage from "./pages/medico/agenda"
import DoctorDashboard from "./pages/medico/dashboard_medico"
import StudiesRequestPage from "./pages/medico/estudios"
import RegistrarPaciente from "./registrar"
import PacientesPage from "./pages/medico/pacientes"
import PacienteDetail from "./pages/medico/paciente"
import HomePage from "./pages/index.jsx"
import { ThemeProvider } from "./lib/ThemeContex"
import GestionHistoria from "@/pages/medico/gestion-historia"
import { Estimulacion } from "./pages/medico/gestion-estimulacion"
import { LaboratorioDashboard } from '@/pages/laboratorio/dashboard_laboratorio'
import { GestionPunsion } from "./pages/laboratorio/punsiones"
import { Punsion } from "./pages/laboratorio/punsion"
import { Ovocito } from "./pages/ovocitos/ovocito"
import { Ovocitos } from "./pages/ovocitos/ovocitos"
import { RouteGuard } from "./lib/RouteGuard"
import { Embriones } from "./pages/laboratorio/embriones"
import {ListadoTratamientosPaciente} from '@/pages/medico/gestion-tratamiento'
import {TratamientoDetalle} from '@/pages/medico/tratamiento'
import {DashboardDirector} from '@/pages/director/dashboard-director'
import { GestionPacientes } from "./pages/director/pacientes"

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>    
                <BrowserRouter>
                    <Routes>
                        <Route path='/login' element={<LoginPage />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/registrar" element={<RegistrarPaciente />} />

                        {/* Rutas de paciente (rol paciente) */}
                        <Route
                            path="/paciente"
                            element={
                                <RouteGuard role={'paciente'}>
                                    <Outlet />
                                </RouteGuard>
                            }
                        >
                            <Route index element={<PatientDashboard />} />
                            <Route path="citas" element={<AppointmentBooking />} />
                            <Route path="mis-citas" element={<MyAppointmentsPage />} />
                            <Route path="historia" element={<HistoriaClinicaPage />} />
                            <Route path="chatbot" element={<ChatbotPage />} />
                            <Route path="donacion" element={<GameteDonation />} />
                        </Route>

                        {/* Rutas generales de pacientes (accesibles por médicos y directores) */}
                        <Route
                            path="/pacientes"
                            element={
                                <RouteGuard allowedRoles={['medico', 'director']}>
                                    <Outlet />
                                </RouteGuard>
                            }
                        >
                            <Route index element={<GestionPacientes />} />
                            <Route path=":id" element={<PacienteDetail />} />
                            <Route path=":id/historial" element={<GestionHistoria/>}/>
                            <Route path=":id/tratamientos" element={<ListadoTratamientosPaciente/>}/>
                            <Route path=":id/estudios" element={<StudiesRequestPage />} />
                            <Route path=":id/ovocitos" element={<Ovocitos />}/>
                            <Route path=":id/embriones" element={<Embriones />}/>
                            <Route path=":id/tratamiento/:tratamientoId" element={<TratamientoDetalle/>}/>
                            <Route path=":id/tratamiento/:tratamientoId/estimulacion" element={<Estimulacion />} />
                        </Route>

                        {/* Rutas generales de ovocitos (accesibles por laboratorio, médicos y directores) */}
                        <Route
                            path="/ovocitos"
                            element={
                                <RouteGuard allowedRoles={['laboratorio', 'medico', 'director']}>
                                    <Outlet />
                                </RouteGuard>
                            }
                        >
                            <Route index element={<Ovocitos />} />
                            <Route path=":id" element={<Ovocito />} />
                        </Route>

                        {/* Rutas generales de embriones (accesibles por laboratorio, médicos y directores) */}
                        <Route
                            path="/embriones"
                            element={
                                <RouteGuard allowedRoles={['laboratorio', 'medico', 'director']}>
                                    <Outlet />
                                </RouteGuard>
                            }
                        >
                            <Route index element={<Embriones />} />
                        </Route>

                        {/* Rutas de médico */}
                        <Route path="/medico" element={
                                <RouteGuard role={'medico'}>
                                    <Outlet />
                                </RouteGuard>
                        }>
                            <Route index element={<DoctorDashboard />} />
                            <Route path="pacientes" element={<PacientesPage />} />
                            <Route path="agenda" element={<AgendaPage />} />
                        </Route>

                        {/* Rutas de director */}
                        <Route path="/director" element={
                                <RouteGuard role={"director"}>
                                    <Outlet />
                                </RouteGuard>
                        }>
                            <Route index element={<DashboardDirector />} />
                        </Route>

                        {/* Rutas de laboratorio */}
                        <Route path="/laboratorio" element={
                                <RouteGuard role={"laboratorio"}>
                                    <Outlet />
                                </RouteGuard>}>
                            <Route index element={<LaboratorioDashboard />} />
                            <Route path="punsiones" element={<GestionPunsion/>}/>
                            <Route path="punsion/:id" element={<Punsion/>}/>
                        </Route>

                        <Route path="*" element={<NotFound />} />
                    </Routes>                
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    )
}
      
export default App