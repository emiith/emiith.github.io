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


// Faculty
function renderFaculty(data) {
    const container = document.getElementById('profilesContainer');
    if (!container) return;

    if (!Array.isArray(data.data)) {
        throw new Error('Fetched data is not an array');
    }

    container.innerHTML = '';

    data.data.slice(1).forEach(faculty => {
        container.innerHTML += `
            <div class="faculty-profile-card">
            <div class="img-container">
                <img src="${faculty.image}" id="facultyImage" class="faculty-image img-fluid" onerror="hideImg()"/>
                <div class="text-overlay">
                    <div class="">
                        <a class="btn-primary" href="${faculty.profile_link}">View Profile</a>
                    </div>
                </div>
            </div>
            <span class="card-title">
                <h6>${faculty.name}</h6>
                <p class="card-text designation">${faculty.designation}</p>
                <div class="row txt">
                    <small>${faculty.position}</small>
                    <small>${faculty.department}</small>
                </div>
                </span>
            <div class="card-body">
                <p>Email: ${faculty.email}</p>
                <div class="social-icons">
                    <a href="${faculty.profile_link}"><i class="bi bi-person-circle"></i> Profile</a>
                </div>
            </div>
        </div>
        `;
    });
}

// Mtech Students
function renderMtechStudents(data) {
    const container = document.getElementById('profilesRow');
    const yearSelect = document.getElementById('yearSelect');
    if (!container) return;
    if (!yearSelect) return;

    const batch  = new URLSearchParams(window.location.search).get('batch')

    if (!Array.isArray(data.data)) {
        throw new Error('Fetched data is not an array');
    }

    let upcoming_year = new URLSearchParams(window.location.search).get('year');
    upcoming_year=null;
    if(upcoming_year==null){
        let date = new Date();
        upcoming_year = date.getFullYear()+1;
    }
    
    yearSelect.innerHTML = `
    <option value="${upcoming_year-3}">${upcoming_year-3}</option>
    <option value="${upcoming_year-2}">${upcoming_year-2}</option>
    `;
    if (batch!=null){
        document.getElementById('yearSelect').value = batch;
    }
    else{
        document.getElementById('yearSelect').value = upcoming_year-3;
    }

    container.innerHTML = '';
    data.data.slice(0).forEach(student => {
        container.innerHTML += `
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="row no-gutters">
                        <div class="col-md-4">
                            <img src="${student.image}" alt="${student.name}" class="card-img">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${student.name}</h5>
                                <p class="card-text">${student.roll_number}</p>
                                <p class="card-text">${student.email}</p>
                                <a href="${student.linkedin}"><i class="bi bi-linkedin"></i></a>
                                ${student.website ? ` <a class="btn btn-sm" target="_blank" href="${student.website}">Profile</a>`: ''}
                            </div>
                        </div>
                    </div>
                </div>
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
    data.data.forEach(event => {

        const currentDate = new Date();
        const eventDate = new Date(event.start_date);
        const end_eventDate = new Date(event.end_data);

        const latestEvents = document.getElementById('latestEvents');
        const upcomingEvents = document.getElementById('upcomingEvents');

        if (currentYear!=year){
            document.getElementById('upev').style.display = 'none';
        }

        if (eventDate > currentDate) {
            upcomingEvents.innerHTML += `
            <div class="col">
                <div class="gallery-item event-gallery-item event-card">
                    <img src="${event.image}" alt="Image 2" onerror="hideImg()" id="HideImg">
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
                                <img src="${event.image}" class="img-fluid mb-3" onerror="hideImg()" id="HideImg"/>
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
                                <p class="card-text">${event.speaker?'Speaker: '+event.speaker:''} ${event.speaker_organization?', ('+event.speaker_organization+')':''}</p>
                                <p class="card-text">${event.venue?'Venue: '+event.venue:''}</p>
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
        'faculty.html':{
            url:'https://script.google.com/macros/s/AKfycbwz-M96z_h4xKt2jfMpqRls0sa8t7EgICumI4eSf-E-GaldJO1RfySYwT5ZSVORtH_w/exec',
            render: renderFaculty
        },
        'm_tech_students.html':{
            url: `https://script.google.com/macros/s/AKfycbyWIkhVOvqFNxDuEaoJBeuYnHm9ZG_ZBmuCm6yb5gcehmXwDQJECwTLtpBerZvkQLUi7A/exec?batch=${new URLSearchParams(window.location.search).get('batch') ?? new Date().getFullYear()-2}`,
            render: renderMtechStudents
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
