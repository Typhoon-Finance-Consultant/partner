import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
    FormGroup,
    Box,
    TextField,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Typography,
    Divider,
    Snackbar,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as yup from 'yup';
import { DOCUMENT_PURPOSE, DOCUMENT_LIST } from '../../../helpers/constants';
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { getDocumentList } from '&/services/loans';
import Loader from '&/components/common/Loader';
import { uploadDocument } from '&/services/loans';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const documentUploadValidationSchema = yup.object().shape({
    password: yup
        .string()
        .trim()
        .optional()
        .min(8, 'Password must be at least 8 characters long'),
    doc_type: yup.string().trim().oneOf(DOCUMENT_LIST, 'Invalid document type'),
    purpose: yup
        .string()
        .trim()
        .oneOf(DOCUMENT_PURPOSE, 'Invalid document purpose'),
    file: yup
        .mixed()
        .required('Document file is required')
        .test('fileType', 'Invalid file type (PDF only)', value => {
            // Check if file is null before accessing type property
            return value && value.type && value.type === 'application/pdf';
        }),
});
const Documents = ({ loanID }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['document'],
        queryFn: async () => getDocumentList({ loan_id: loanID }),
    });
    const formik = useFormik({
        initialValues: {
            password: '',
            doc_type: 'PAN',
            purpose: 'IDENTITY',
            file: null,
            loan_id: loanID,
        },
        onSubmit: (values, actions) => {
            console.log('Document Upload', values);
            const form = new FormData();
            form.append('file', values.file, values?.file?.name);
            form.append('password', values.password);
            form.append('doc_type', values.doc_type);
            form.append('purpose', values.purpose);
            form.append('loan_id', loanID);

            uploadDocument(form)
                .then(res => {
                    setSnackbarMessage(res.response || res.message);
                    setModalOpen(true);
                    actions.setSubmitting(false);
                    refetch();
                })
                .catch(error => {
                    setModalOpen(true);
                    setSnackbarMessage('Something went wrong');
                    actions.setSubmitting(false);
                });
        },
        validationSchema: documentUploadValidationSchema,
    });

    const [formDisabled, setFormDisbaled] = useState(false);
    if (isLoading) {
        return <Loader loaderText="Loading Document List" />;
    }
    const documentData = data?.code === 200 ? data.response : [];
    return (
        <Box>
            <Box className="">
                <Typography
                    variant="h6"
                    className="font-bold text-gray-500 mb-5">
                    {' '}
                    Uploaded Files
                </Typography>
                <Box className="mb-5">
                    <Box>
                        {documentData.map(item => {
                            return (
                                <Box
                                    className="grid xs:grid-cols-2 md:grid-cols-5 border md:p-5 xs:p-2"
                                    key={item.id}>
                                    <Box>
                                        <Typography className="text-sm">
                                            Document Type
                                        </Typography>

                                        <Typography className="text-lg">
                                            {' '}
                                            {item.doc_type}{' '}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography className="text-sm">
                                            Purpose
                                        </Typography>

                                        <Typography className="text-lg">
                                            {' '}
                                            {item.purpose}{' '}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography className="text-sm">
                                            Password
                                        </Typography>
                                        <Typography className="text-lg">
                                            {' '}
                                            {item.password}{' '}
                                        </Typography>
                                    </Box>
                                    <Box className="col-span-2">
                                        <Typography className="text-sm">
                                            Document Link
                                        </Typography>
                                        <Typography className="text-lg">
                                            {' '}
                                            {item.file}{' '}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography
                            variant="h6"
                            className="font-bold text-gray-500 mb-5">
                            {' '}
                            Upload New Documents
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth className="mb-8">
                            <InputLabel size="small" id="document_type">
                                Document Type
                            </InputLabel>
                            <Select
                                labelId="document_type"
                                size="small"
                                disabled={formDisabled}
                                name="doc_type"
                                value={formik.values.doc_type}
                                onChange={formik.handleChange}>
                                {DOCUMENT_LIST.map(item => (
                                    <MenuItem value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth className="mb-8">
                            <InputLabel size="small" id="document_purpose">
                                Document Purpose
                            </InputLabel>
                            <Select
                                labelId="document_purpose"
                                size="small"
                                disabled={formDisabled}
                                name="document_purpose"
                                value={formik.values.purpose}
                                onChange={formik.handleChange}>
                                {DOCUMENT_PURPOSE.map(item => (
                                    <MenuItem value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormGroup className="mb-8">
                            <TextField
                                name="password"
                                variant="outlined"
                                label="Password"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                disabled={formDisabled}
                                fullWidth
                                size="small"
                                error={
                                    formik.touched.password &&
                                    formik.errors.password
                                }
                                helperText={
                                    formik.touched.password &&
                                    formik.errors.password
                                }
                            />
                        </FormGroup>
                        <FormGroup className="mb-8">
                            <Button
                                className=""
                                variant="contained"
                                component="label"
                                tabIndex={-1}
                                role={undefined}
                                startIcon={<CloudUploadIcon />}
                                color="secondary">
                                {!!formik.values.file
                                    ? formik.values.file.name
                                    : 'Select Document'}
                                <VisuallyHiddenInput
                                    type="file"
                                    name="file"
                                    // value={formik.values.file}
                                    onChange={event => {
                                        console.log('Form Event', event);
                                        formik.setFieldValue(
                                            'file',
                                            event.target.files[0],
                                        );
                                    }}
                                />
                            </Button>
                        </FormGroup>
                    </Grid>
                </Grid>
                <Divider className="mb-8" />
                <div className="grid md:grid-cols-3">
                    <FormGroup className="mb-8">
                        <Button
                            className=""
                            variant="contained"
                            color="primary"
                            onClick={formik.handleSubmit}>
                            Upload Document
                        </Button>
                    </FormGroup>
                </div>
            </Box>
            <Snackbar
                open={modalOpen}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={() => setModalOpen(false)}
                message={snackbarMessage}
            />
        </Box>
    );
};

export default Documents;
