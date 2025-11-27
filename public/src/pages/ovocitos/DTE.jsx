import React from 'react';
import { Trash2, Calendar } from 'lucide-react';

export const DTE = ({ transiciones }) => {

    const formatearFecha = (fecha) => {
        const [year, month, day] = fecha.split('/');
        return `${day}/${month}/${year}`;
    };

    const esUltimoEstado = (index) => {
        return index === transiciones.length - 1;
    };

    const mostrarIconoBasura = (estado) => {
        return estado.toLowerCase() === 'descartado';
    };

    const getColorEstado = (estado) => {
        const estadoLower = estado.toLowerCase();
        switch(estadoLower) {
            case "maduro":
                return "bg-green-500 text-white";
            case "inmaduro":
                return "bg-yellow-500 text-black";
            case "muy inmaduro":
                return "bg-blue-500 text-white";
            case "in vitro":
                return "bg-purple-500 text-white";
            case "criopreservado":
                return "bg-cyan-600 text-white";
            case "descartado":
                return "bg-red-600 text-white";
            case "fecundado":
                return "bg-pink-500 text-white";
            default:
                return "bg-gray-400 text-white";
        }
    };

    return (
        <div className="w-full cursor-pointer">
            <div className="max-w-7xl mx-auto ">
                <div className=" rounded-xl p-8 overflow-x-auto">
                    <div className="flex items-center justify-start min-w-max pb-4">
                        {((transiciones == undefined || transiciones.length == 0)&&(<></>))
                        ||transiciones.map((transicion, index) => (
                            <React.Fragment key={index}>
                            <div className="flex flex-col items-center">
                                <div className="mb-4 flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                                    <Calendar size={14} className="text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {formatearFecha(transicion.fecha)}
                                    </span>
                                </div>
                                    
                                <div className="relative">
                                    <div className={`w-56 h-28 rounded-2xl bg-gradient-to-br ${getColorEstado(transicion.estado)} shadow-lg flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
                                        <div className="text-center">
                                            <div className="text-white text-xl font-bold capitalize">
                                                {transicion.estado}
                                            </div>
                                            <div className="text-white/80 text-sm mt-1">
                                                Estado {index + 1} de {transiciones.length}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {!esUltimoEstado(index) && (
                                <div className="flex items-center mx-6 ">
                                    <div className="flex items-center">
                                        <div className="w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                                        <div className="w-0 h-0 border-t-10 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-gray-400"></div>
                                    </div>
                                </div>
                            )}

                            {esUltimoEstado(index) && mostrarIconoBasura(transicion.estado) && (
                                <div className="flex items-center ml-6">
                                    <div className="flex items-center mr-4">
                                        <div className="w-12 h-1 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                                        <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-gray-400"></div>
                                    </div>
                                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Trash2 className="text-white" size={32} />
                                    </div>
                                </div>
                            )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

