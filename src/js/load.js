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




document.addEventListener("DOMContentLoaded", function() {
    const loading = document.getElementById('loading');
    loading.style.display = 'flex';

    const urlMapping = {
        'research.html':{
            url:'https://script.google.com/macros/s/AKfycbydfK1qUy1pRUIFhyHgHS2LC_th1aXWCnvy6rsO3XQDNn-zfjJ5sY5uG7ROPBaNh3pe5w/exec',
            render: renderResearch
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
