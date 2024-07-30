// Submit Form
function submitForm() {
    document.getElementById('yearForm').submit();
}

// Hide image on error
function hideImg() {
    document.getElementById("HideImg").style.display = "none";
}

// Fetch Data
async function fetchData(url) {
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        console.log(data.data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    loading.style.display = 'none';
}


// Rendering functions for different pages

// Reasearch 
function renderResearch(data) {
    const container = document.getElementById('dataContainer');
    if (!container) return;

    if (!Array.isArray(data.data)) {
        throw new Error('Fetched data is not an array');
    }

    container.innerHTML = '';

    data.data.forEach(project => {
        container.innerHTML += `
            <tr>
                <td>${project.project}</td>
                <td>${project.faculty}</td>
                <td>${project.funding_body}</td>
            </tr>
        `;
    });
}

// Events
function renderEvents(data) {
    const upcomingEvents = document.getElementById('upcomingEvents');
    const latestEvents = document.getElementById('latestEvents');
    let upcomingEventsCount = 0;
    let latestEventsCount = 0;
    
    if (!upcomingEvents) return;
    if (!latestEvents) return;

    if (!Array.isArray(data.data)) {
        throw new Error('Fetched data is not an array');
    }


    let year = new URLSearchParams(window.location.search).get('year');
    let date = new Date();
    let currentYear = date.getFullYear();
    const yearSelect = document.getElementById('yearSelect');

    for (let i = 2022; i <= currentYear; i++) {
        let option = new Option(i, i);
        yearSelect.add(option);
    }

    if (year == null) {
        year = currentYear;
    }
    yearSelect.value = year;
    

    upcomingEvents.innerHTML = '';
    latestEvents.innerHTML = '';
    console.log(data);
    data.data.forEach(event => {

        const currentDate = new Date();
        const eventDate = new Date(event.start_date);
        const end_eventDate = new Date(event.end_data);

        const latestEvents = document.getElementById('latestEvents');
        const upcomingEvents = document.getElementById('upcomingEvents');

        if (currentYear!=year){
            console.log('yes');
            document.getElementById('upev').style.display = 'none';
        }

        if (eventDate > currentDate) {
            upcomingEvents.innerHTML += `
            <div class="col">
                <div class="gallery-item event-gallery-item event-card">
                    <img src="${event.image}" alt="Image 2">
                    <div class="text-box card-body">
                        <h5>${event.title}</h5>
                        <p class="event-date">${eventDate.toDateString()!='Invalid Date'?eventDate.toDateString().slice(3,):'----'}</p>
                    </div>
                    <div class="text-overlay">
                        <div class="text-overlay-content">
                            <button class="btn-primary" data-bs-toggle="modal" data-bs-target="#eventModal${event.id}">Read More</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal -->
                <div class="modal fade" id="eventModal${event.id}" tabindex="-1" role="dialog" aria-labelledby="eventModalLabel${event.id}" aria-hidden="true">
                    <div class="modal-dialog model-lg modal-dialog-centered modal-dialog-scrollable" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="eventModalLabel${event.id}">${event.title}</h5>
                            </div>
                            <div class="modal-body">
                                <img src="${event.image}" class="img-fluid mb-3"/>
                                <p class="card-text event_date">${eventDate.toDateString()!='Invalid Date'?eventDate.toDateString().slice(3,):'----'}</p>
                                <p class="card-text">${event.venue}</p>
                                <p>${event.description}</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
        `;
        upcomingEventsCount++;
        }
        else {
            latestEvents.innerHTML += `
            <div class="col">
                <div class="gallery-item event-gallery-item event-card">
                    <img src="${event.image}" alt="Image 2">
                    <div class="text-box card-body">
                        <h5>${event.title}</h5>
                        <p class="event-date">${eventDate.toDateString()!='Invalid Date'?eventDate.toDateString().slice(3,):'----'}</p>
                    </div>
                    <div class="text-overlay">
                        <div class="text-overlay-content">
                            <button class="btn-primary" data-bs-toggle="modal" data-bs-target="#eventModal${event.id}">Read More</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal -->
                <div class="modal fade" id="eventModal${event.id}" tabindex="-1" role="dialog" aria-labelledby="eventModalLabel${event.id}" aria-hidden="true">
                    <div class="modal-dialog model-lg modal-dialog-centered modal-dialog-scrollable" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="eventModalLabel${event.id}">${event.title}</h5>
                            </div>
                            <div class="modal-body">
                                <img src="${event.image}" class="img-fluid mb-3"/>
                                <p class="card-text event_date">${eventDate.toDateString()!='Invalid Date'?eventDate.toDateString().slice(3,):'----'}</p>
                                <p class="card-text">${event.venue}</p>
                                <p>${event.description}</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            latestEventsCount++;
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const loading = document.getElementById('loading');
    loading.style.display = 'flex';

    const urlMapping = {
        'research.html':{
            url:'https://script.google.com/macros/s/AKfycbydfK1qUy1pRUIFhyHgHS2LC_th1aXWCnvy6rsO3XQDNn-zfjJ5sY5uG7ROPBaNh3pe5w/exec',
            render: renderResearch
        },
        'events.html':{
            url:'https://script.google.com/macros/s/AKfycbx-ZZ69ZxX0EQCcIPxPGUVECFNwkqeVlLCcaJOSEUn1IgdkgEYrVPEnAMNb69Zs8sCi9A/exec',
            render: renderEvents
        },
    };

    const page = location.pathname.split('/').pop();
    const pageConfig = urlMapping[page];

    if (pageConfig) {
        fetchData(pageConfig.url).then(data => {
            if (data) {
                pageConfig.render(data);
                loading.style.display = 'none';
            }
        });
    }
});
