const express = require('express');
const path = require('path');
const app = express();

// Reemplaza 'tu-proyecto-angular' con el nombre real de tu proyecto
app.use(express.static(path.join(__dirname, 'dist/pharma-sales.pa')));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/pharma-sales.pa/index.html'));
});

app.listen(process.env.PORT || 8080);