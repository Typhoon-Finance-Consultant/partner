import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Container, Box, Snackbar } from '@mui/material';
import LeadFormClient from '&/components/CreateLead/LeadFormClient';
import LoanRequestForm from '&/components/CreateLead/LoanRequestForm';

const CreateLead = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { leadID } = useParams();

    return (
        <Container maxWidth={false} className="bg-slate-200 min-h-lvh">
            <Box className=" grid md:justify-center md:items-center md:grid-cols-2  min-h-lvh py-10 sm:py-0 ">
                <Box >
                    {!leadID ? (
                        <LeadFormClient
                            setModalOpen={setModalOpen}
                            setSnackbarMessage={setSnackbarMessage}
                        />
                    ) : (
                        <LoanRequestForm
                            setModalOpen={setModalOpen}
                            setSnackbarMessage={setSnackbarMessage}
                            leadID={leadID}
                        />
                    )}
                </Box>
                <Snackbar
                    open={modalOpen}
                    autoHideDuration={6000}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    onClose={() => setModalOpen(false)}
                    message={snackbarMessage}
                />
            </Box>
        </Container>
    );
};

export default CreateLead;
