import React, {useEffect, useRef, useState} from 'react';
import Chart from 'chart.js/auto';
import {Gauge, gaugeClasses} from '@mui/x-charts/Gauge';
import {customFetch} from '../../utils/customFetch.js';
import DataTable from "../../composants/Administration/Gestion/Ressource/dataTable";
import apiConfig from "../../utils/config";
import './Dashboard_admin.css';
import {DateRange} from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import CircularProgress from '@mui/material/CircularProgress';
import TriComponent from "../../composants/Ressource/TriComponent";
import {redirect, useLoaderData} from "react-router-dom";
import html2canvas from "html2canvas";

const DashboardAdmin = () => {
    const [loading, setLoading] = useState(true);
    const [totalRessources, setTotalRessources] = useState(null);
    const [dataRessourceByVue, setDataRessourceByVue] = useState([]);
    const [totalRessourcesNonValider, setTotalRessourcesNonValider] = useState(null);
    const [totalUtilisateurs, setTotalUtilisateurs] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDateRange, setSelectedDateRange] = useState([
        {
            startDate: new Date(new Date().getFullYear(), 0, 1),
            endDate: new Date(new Date().getFullYear(), 11, 31),
            key: 'selection'
        }
    ]);
    const [dataStatistique, setDataStatistique] = useState(null);
    const userChartRef = useRef(null);
    const ressourceChartRef = useRef(null);
    const {options} = useLoaderData();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTypeRelation, setSelectedTypeRelation] = useState(null);
    const [selectedTypeRessource, setSelectedTypeRessource] = useState(null);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };


    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching data...");
            try {
                let vueUrl = `${apiConfig.apiUrl}/api/ressources?page=1&order%5BnombreVue%5D=desc&dateCreation%5Bbefore%5D=${formatDate(selectedDateRange[0].endDate)}&dateCreation%5Bafter%5D=${formatDate(selectedDateRange[0].startDate)}`;
                let nonValiderUrl = `${apiConfig.apiUrl}/api/ressources?statut=2&dateCreation%5Bbefore%5D=${formatDate(selectedDateRange[0].endDate)}&dateCreation%5Bafter%5D=${formatDate(selectedDateRange[0].startDate)}`;
                let ressourceParMoisUrl = `${apiConfig.apiUrl}/api/dashboard_admin/ressourcesByMonth?dateCreation%5Bbefore%5D=${formatDate(selectedDateRange[0].endDate)}&dateCreation%5Bafter%5D=${formatDate(selectedDateRange[0].startDate)}`;

                if (selectedCategory) {
                    vueUrl += `&categorie=${selectedCategory}`;
                    nonValiderUrl += `&categorie=${selectedCategory}`;
                    ressourceParMoisUrl += `&categorie=${selectedCategory}`;
                }

                if (selectedTypeRelation) {
                    vueUrl += `&typeRelations=${selectedTypeRelation}`;
                    nonValiderUrl += `&typeRelations=${selectedTypeRelation}`;
                    ressourceParMoisUrl += `&typeRelations=${selectedTypeRelation}`;
                }

                if (selectedTypeRessource) {
                    vueUrl += `&typeDeRessource=${selectedTypeRessource}`;
                    nonValiderUrl += `&typeDeRessource=${selectedTypeRessource}`;
                    ressourceParMoisUrl += `&typeDeRessource=${selectedTypeRessource}`;
                }

                console.log('RessourcemoisURL' + ressourceParMoisUrl);

                const [vueData, nonValiderData, ressourceParMois, utilisateurData] = await Promise.all([
                    customFetch({url: vueUrl, method: 'GET', headers: {'Content-Type': 'application/json'}}, true),
                    customFetch({
                        url: nonValiderUrl,
                        method: 'GET',
                        headers: {'Content-Type': 'application/json'}
                    }, true),
                    customFetch({
                        url: ressourceParMoisUrl,
                        method: 'GET',
                        headers: {'Content-Type': 'application/json'}
                    }, true),
                    customFetch({
                        url: `${apiConfig.apiUrl}/api/utilisateurs`,
                        method: 'GET',
                        headers: {'Content-Type': 'application/json'}
                    }, true)
                ]);

                setLoading(false);

                if (vueData && vueData.data) {
                    setDataRessourceByVue(vueData.data['hydra:member']);
                    setTotalRessources(vueData.data['hydra:totalItems']);
                }

                if (nonValiderData && nonValiderData.data) {
                    setTotalRessourcesNonValider(nonValiderData.data['hydra:totalItems']);
                }

                if (utilisateurData && utilisateurData.data) {
                    setTotalUtilisateurs(utilisateurData.data['hydra:totalItems']);
                }

                if (ressourceParMois && ressourceParMois.data) {
                    setDataStatistique(ressourceParMois.data);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Handle error by setting loading to false
            }
        };

        setLoading(true);
        fetchData(); // Initial call
    }, [selectedDateRange, selectedCategory, selectedTypeRelation, selectedTypeRessource]);


    useEffect(() => {
        // Créer le pie chart pour le nombre d'utilisateurs
        if (dataStatistique && userChartRef.current) {
            // Destroy previous chart instance if exists
            if (userChartRef.current.chart) {
                userChartRef.current.chart.destroy();
            }

            const ctx = userChartRef.current.getContext('2d');
            userChartRef.current.chart = new Chart(ctx, {
                type: 'pie',
                width: 400,
                height: 400,
                data: {
                    labels: ['Utilisateurs vérifiés', 'Utilisateurs non vérifiés', 'Utilisateurs bannis'],
                    datasets: [{
                        label: 'Nombre d\'utilisateurs',
                        data: [dataStatistique['verifier'], dataStatistique['non_verifier'], dataStatistique['bannis']],
                        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }, [dataStatistique]);

    useEffect(() => {
        // Créer le pie chart pour le nombre de ressources
        if (dataStatistique && ressourceChartRef.current) {
            // Destroy previous chart instance if exists
            if (ressourceChartRef.current.chart) {
                ressourceChartRef.current.chart.destroy();
            }

            const ctx = ressourceChartRef.current.getContext('2d');
            ressourceChartRef.current.chart = new Chart(ctx, {
                type: 'pie',
                width: 400,
                height: 400,
                data: {
                    labels: ['Ressources valides', 'Ressources en attente', 'Ressources refusées'],
                    datasets: [{
                        label: 'Nombre de ressources',
                        data: [dataStatistique['ressource_valide'], dataStatistique['ressource_en_attente'], dataStatistique['ressource_refuse']],
                        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }, [dataStatistique]);

    const dataParMois = dataStatistique ? dataStatistique['ressources'] : [];

    console.log('dataParMois:', dataParMois);

    useEffect(() => {
        if (dataParMois.length > 0) {
            const labels = dataParMois.map(item => item.moisCreation);
            const data = dataParMois.map(item => item.count);

            const ctx = document.getElementById('lineChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Nombre de ressources créées par mois',
                        data: data,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        pointRadius: 5,
                        pointBackgroundColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)', // Couleur des lignes verticales
                                borderColor: 'transparent', // Couleur de la bordure des lignes verticales
                                tickLength: 0, // Longueur des lignes de la grille des x
                                borderDash: [3, 3] // Style de trait pour les lignes verticales
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    elements: {
                        point: {
                            radius: 5
                        }
                    }
                }
            });

        }
    }, [dataStatistique]);

    const handleShowCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const handleSelect = (ranges) => {
        setSelectedDateRange([ranges.selection]);
        // You can use ranges.selection.startDate and ranges.selection.endDate to filter your data
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleTypeRelationChange = (typeRelation) => {
        setSelectedTypeRelation(typeRelation);
    };

    const handleTypeRessourceChange = (typeRessource) => {
        setSelectedTypeRessource(typeRessource);
    };

    const handleExport = () => {
        html2canvas(document.querySelector("body")).then(canvas => {
            const link = document.createElement('a');
            link.download = 'dashboard-screenshot.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    const columns = [
        {label: 'Titre', field: 'titre'},
        {label: 'Date de création', field: 'dateCreation', renderDate: true},
        {label: 'Nombre de vue', field: 'nombreVue'},
        {label: 'Propriétaire', render: row => `${row.proprietaire.nom} ${row.proprietaire.prenom}`},
    ];

    return (
        <div className="dashboard-container">
            <div className={"filter-container"}>
                <button className="calendar-button" onClick={handleShowCalendar}>
                    {showCalendar ? 'Cacher le calendrier' : 'Afficher le calendrier'}
                </button>
                {showCalendar && (
                    <div className="date-range-picker">
                        <DateRange
                            editableDateInputs={true}
                            onChange={handleSelect}
                            moveRangeOnFirstSelection={false}
                            ranges={selectedDateRange}
                        />
                    </div>
                )}
                <TriComponent
                    label="Catégories"
                    categories={options.categories || []}
                    onChangeTri={handleCategoryChange}
                    aucunActif={true}
                />
                <TriComponent
                    label="Type de relations"
                    categories={options.relationTypes || []}
                    onChangeTri={handleTypeRelationChange}
                    aucunActif={true}
                />
                <TriComponent
                    label="Type de ressources"
                    categories={options.resourceTypes || []}
                    onChangeTri={handleTypeRessourceChange}
                    aucunActif={true}
                />
            </div>
            <a onClick={handleExport}
               style={{backgroundColor: '#1AA4C8', borderRadius: '4px', padding: '5px', color: "white"}}> Exporter </a>
            <div className="containerstat">
                <div className="block-stat">
                    <div className="title-stat">Nombre de ressources :</div>
                    <div className="nb-ressources">
                        {loading ? (
                            <CircularProgress/>
                        ) : (
                            <Gauge width={200} height={200} value={totalRessources} valueMin={0}
                                   valueMax={totalRessources}/>
                        )}
                    </div>
                </div>
                <div className="block-stat">
                    <div className="title-stat">Nombre de ressources non validées :</div>
                    <div className="chart">
                        {loading ? (
                            <CircularProgress/>
                        ) : (
                            <Gauge
                                value={totalRessourcesNonValider}
                                startAngle={-110}
                                endAngle={110}
                                valueMax={totalRessources}
                                width={250}
                                height={250}
                                sx={{
                                    [`& .${gaugeClasses.valueText}`]: {
                                        fontSize: 30,
                                        transform: 'translate(0px, 0px)',
                                    },
                                }}
                                text={({value, valueMax}) => `${value} / ${valueMax}`}
                            />
                        )}
                    </div>
                </div>
                <div className="block-stat">
                    <div className="title-stat">Nombre d'utilisateurs :</div>
                    <div className={"chart"}>
                        {loading ? (
                            <CircularProgress/>
                        ) : (
                            <canvas ref={userChartRef} width="400" height="250"></canvas>
                        )}
                    </div>
                </div>
                <div className="block-stat">
                    <div className="title-stat">Nombre de ressources créées par mois :</div>
                    <div className="chart">
                        {loading ? (
                            <CircularProgress/>
                        ) : (
                            <div className="chart">
                                <canvas id="lineChart" width="600" height="300"></canvas>
                            </div>
                        )}
                    </div>
                </div>
                <div className="block-stat">
                    <div className="title-stat">Nombres de ressources :</div>
                    <div className="chart">
                        {loading ? (
                            <CircularProgress/>
                        ) : (
                            <canvas ref={ressourceChartRef} width="400" height="250"></canvas>
                        )}
                    </div>
                </div>
            </div>
            <div className="datatable">
                <h2>Ressources les plus vues : </h2>
                <DataTable data={dataRessourceByVue} loading={loading} columns={columns}/>
            </div>
        </div>
    );
};

export default DashboardAdmin;

export async function loader() {
    let {data, error} = await customFetch({
        url: `${apiConfig.apiUrl}/api/options`,
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }, true);

    if (error && error.message && error.message.includes('DECONNEXION NECCESSAIRE')) {
        return redirect('/connexion');
    }

    return {
        options: data,
    };
}
