import express from 'express';
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getDoctors,
  getTreatments
} from '../db/index.js';

const router = express.Router();

// GET /api/patients - Get all patients with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const {
      search,
      status,
      treatment,
      dateFrom,
      dateTo,
      orderBy = 'patient_id',
      orderDirection = 'ASC',
      page = 1,
      limit = 12
    } = req.query;

    const filters = {
      search,
      status,
      treatment,
      dateFrom,
      dateTo,
      orderBy,
      orderDirection: orderDirection.toUpperCase()
    };

    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    filters.offset = offset;
    filters.limit = parseInt(limit);

    const patients = await getPatients(filters);
    
    // Get total count for pagination
    const totalFilters = { ...filters };
    delete totalFilters.offset;
    delete totalFilters.limit;
    const totalPatients = await getPatients(totalFilters);
    const totalCount = totalPatients.length;

    res.json({
      patients,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// GET /api/patients/:id - Get a specific patient
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await getPatientById(id);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// POST /api/patients - Create a new patient
router.post('/', async (req, res) => {
  try {
    const patientData = req.body;
    
    // Validate required fields
    if (!patientData.firstName || !patientData.lastName || !patientData.dateOfBirth) {
      return res.status(400).json({ 
        error: 'Missing required fields: firstName, lastName, dateOfBirth' 
      });
    }

    // Generate patient ID if not provided
    if (!patientData.patientId) {
      const existingPatients = await getPatients();
      const nextId = Math.max(...existingPatients.map(p => parseInt(p.patient_id) || 0)) + 1;
      patientData.patientId = nextId.toString().padStart(3, '0');
    }

    const patient = await createPatient(patientData);
    res.status(201).json(patient);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// PUT /api/patients/:id - Update a patient
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const patientData = req.body;
    
    const patient = await updatePatient(id, patientData);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

// DELETE /api/patients/:id - Delete a patient
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await deletePatient(id);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});

// GET /api/patients/doctors/list - Get list of doctors for dropdowns
router.get('/doctors/list', async (req, res) => {
  try {
    const doctors = await getDoctors();
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// GET /api/patients/treatments/list - Get list of treatments for dropdowns
router.get('/treatments/list', async (req, res) => {
  try {
    const treatments = await getTreatments();
    res.json(treatments);
  } catch (error) {
    console.error('Error fetching treatments:', error);
    res.status(500).json({ error: 'Failed to fetch treatments' });
  }
});

export default router;
