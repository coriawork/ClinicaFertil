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
import { Calendar } from "./components/ui/calendargod"
import { LaboratorioDashboard } from '@/pages/laboratorio/dashboard_laboratorio'
import { GestionPunsion } from "./pages/laboratorio/punsiones"
import { Punsion } from "./pages/laboratorio/punsion"
import { Ovocito } from "./pages/ovocitos/ovocito"
import { Ovocitos } from "./pages/ovocitos/ovocitos"
import { RouteGuard } from "./lib/RouteGuard"
import { Embriones } from "./pages/laboratorio/embriones"
import {ListadoTratamientosPaciente} from '@/pages/medico/gestion-tratamiento'
import {TratamientoDetalle} from '@/pages/medico/tratamiento'
import { useAuth } from "./lib/AuthContext"
function App() {
    return (
        <ThemeProvider>
            <AuthProvider>    
                <BrowserRouter>
                    <Routes>
                        <Route path="/calendar" element={
                           <div className="w-full h-full bg-background justify-center items-center flex mt-20">
                                <div className="w-300">
                                    <Calendar/>
                                </div>
                           </div>
                        }/>
                        <Route path='/login' element={<LoginPage />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/registrar" element={<RegistrarPaciente />} />

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
                            <Route path="ovocitos" element={<Ovocitos role={'paciente'}/>}/>
                            <Route path="embriones" element={<Embriones role={'paciente'}/>}/>
                            <Route path="ovocito/:id" element={<Ovocito/>}/>
                        </Route>
                        <Route path="/medico" element={
                                <RouteGuard role={'medico'}>
                                    <Outlet />
                                </RouteGuard>
                        }>
                            {/* /medico/paciente */}
                            <Route path="pacientes" element={ <Outlet />} >
                                <Route index element={<PacientesPage />} />
                                <Route path=":id" element={<PacienteDetail />} />
                                <Route path="historial/:id" element={<GestionHistoria/>}/>
                                <Route path="tratamientos/:id" element={<ListadoTratamientosPaciente/>}/>
                                <Route path="estudios/:id" element={<StudiesRequestPage />} />
                                <Route path="tratamiento" element={ <Outlet />} >
                                    {/* /medico/paciente/tratamiento */}
                                    <Route path=":id" element={<TratamientoDetalle/>}/>
                                    {/* /medico/pacientes/estimulacion/id */}
                                    <Route path="estimulacion/:id" element={<Estimulacion />} />
                                    
                                </Route>
                            </Route>
                            <Route index element={<DoctorDashboard />} />
                            <Route path="agenda" element={<AgendaPage />} />
                        </Route>

                        <Route path="/laboratorio" element={
                                <RouteGuard role={"laboratorio"}>
                                    <Outlet />
                                </RouteGuard>}>
                            <Route index element={<LaboratorioDashboard />} />
                            <Route path="punsiones" element={<GestionPunsion/>}/>
                            <Route path="ovocitos" element={<Ovocitos role={"laboratorio"}/>} /> 
                            <Route path="embriones" element={<Embriones role={"laboratorio"}/>} /> 
                            <Route path="punsion/:id" element={<Punsion/>}/>
                            <Route path="ovocito/:id" element={<Ovocito/>}/>
                        </Route>

                        <Route path="*" element={<NotFound />} />
                    </Routes>                
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    )
}
      
export default App