import React, { useCallback, useState } from 'react';
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
    Paper,
    Typography,
    Divider,
    Snackbar,
    Autocomplete,
} from '@mui/material';
import * as yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { getEmployerList, updateIncomeProfile } from '&/services/loans';
import Loader from '&/components/common/Loader';
import { IncomeTypes, DESIGNATION_OPTIONS } from '&/helpers/constants';
import DatePicker from '&/components/common/Form/DatePicker';
import dayjs from 'dayjs';

const incomeProfileValidationSchema = yup.object().shape({
    income_type: yup
        .string()
        .oneOf(Object.values([1, 2]), 'Invalid income type'),
    net_income: yup
        .number()
        .positive('Net income must be positive')
        .required('Net income is required'),
    gross_income: yup
        .number()
        .positive('Gross income must be positive')
        .required('Gross income is required'),
    designation: yup
        .string()
        .trim()
        .max(150, 'Designation cannot exceed 150 characters'),
    employer: yup
        .string()
        .nullable(true)
        .when('income_type', {
            is: IncomeTypes.SALARIED,
            then: yup
                .string()
                .required('Employer is required for salaried income'),
        }),
    date_of_joining_or_incorporation: yup.date().nullable(true),
    total_emi_ongoing: yup.number().required('EMI amount is required'),
    remark: yup.string().trim().optional(),
});

const IncomeProfile = ({ loanID, incomeProfile }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { data, isLoading } = useQuery({
        queryKey: ['employerList'],
        queryFn: async () => getEmployerList(),
    });
    const formik = useFormik({
        initialValues: {
            income_type: incomeProfile?.income_type || 1,
            net_income: incomeProfile?.net_income || 1,
            gross_income: incomeProfile?.gross_income,
            designation: incomeProfile?.designation,
            employer: incomeProfile?.employer,
            date_of_joining_or_incorporation:
                incomeProfile?.date_of_joining_or_incorporation,
            total_emi_ongoing: incomeProfile?.total_emi_ongoing || 0,
            loan_id: loanID,
            legal_name: incomeProfile?.legal_name,
            entity_type: incomeProfile?.entity_type || 'SHOP',
            total_work_experience_in_months:
                incomeProfile?.total_work_experience_in_months || 0,
            current_work_experience_in_months:
                incomeProfile?.current_work_experience_in_months || 0,
        },
        // validationSchema: incomeProfileValidationSchema,
        onSubmit: (values, actions) => {
            console.log('Upload Income Response', values);
            const body = {
                ...values,

                date_of_joining_or_incorporation:
                    values.date_of_joining_or_incorporation
                        ? dayjs(values.date_of_joining_or_incorporation).format(
                              'DD/MM/YYYY',
                          )
                        : null,
            };
            actions.setSubmitting(true);
            updateIncomeProfile(body)
                .then(res => {
                    setSnackbarMessage(res.response || res.message);
                    setModalOpen(true);
                    actions.setSubmitting(false);
                })
                .catch(error => {
                    setModalOpen(true);
                    setSnackbarMessage('Something went wrong');
                    actions.setSubmitting(false);
                });
        },
    });
    const [formDisabled, setFormDisabled] = useState(true);
    const handleEmployerNameChange = useCallback(value => {
        if (formik.values.employer !== value) {
            console.log('Event Name ', value);

            formik.setFieldValue('employer', value);
        }
    });

    const handleDesignationChange = useCallback(value => {
        if (formik.values.designation !== value) {
            console.log('Event Name  2', value);

            formik.setFieldValue('designation', value);
        }
    });
    if (isLoading) {
        return <Loader loaderText="Fetching Information" />;
    }
    const employerNameList =
        data?.code === 200 ? data?.response?.map(item => item.name) : [];
    // ? data?.response?.map(item => ({
    //       label: item.name,
    //       value: item.name,
    //   }))
    // : [];

    return (
        <Box className="mt-5">
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Box className="py-2">
                        <FormControl fullWidth className="mb-8">
                            <InputLabel size="small" id="income_type">
                                Income Type
                            </InputLabel>
                            <Select
                                labelId="income_type"
                                size="small"
                                disabled={formDisabled}
                                name="income_type"
                                onBlur={formik.hanleBlur}
                                value={formik.values.income_type}
                                onChange={formik.handleChange}>
                                <MenuItem value={1}>Salaried</MenuItem>
                                <MenuItem value={2}>Self Employed</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth className="mb-8">
                            <TextField
                                name="net_income"
                                variant="outlined"
                                label="Net Income"
                                type="number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.net_income}
                                disabled={formDisabled}
                                fullWidth
                                size="small"
                                error={
                                    formik.touched.net_income &&
                                    formik.errors.net_income
                                }
                                helperText={
                                    formik.touched.net_income &&
                                    formik.errors.net_income
                                }
                            />
                        </FormControl>
                        <FormControl fullWidth className="mb-8">
                            <TextField
                                name="gross_income"
                                variant="outlined"
                                label="Gross Income"
                                type="number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.gross_income}
                                disabled={formDisabled}
                                fullWidth
                                size="small"
                                error={
                                    formik.touched.gross_income &&
                                    formik.errors.gross_income
                                }
                                helperText={
                                    formik.touched.gross_income &&
                                    formik.errors.gross_income
                                }
                            />
                        </FormControl>
                        <FormControl fullWidth className="mb-8">
                            <TextField
                                name="total_emi_ongoing"
                                variant="outlined"
                                label="Total Ongoing EMI"
                                type="number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.total_emi_ongoing}
                                disabled={formDisabled}
                                fullWidth
                                size="small"
                                error={
                                    formik.touched.total_emi_ongoing &&
                                    formik.errors.total_emi_ongoing
                                }
                                helperText={
                                    formik.touched.total_emi_ongoing &&
                                    formik.errors.total_emi_ongoing
                                }
                            />
                        </FormControl>
                    </Box>
                </Grid>
                {formik.values.income_type === 1 ? (
                    <Grid item xs={12} md={4}>
                        <Box className="py-2">
                            <FormControl fullWidth className="mb-8">
                                <Autocomplete
                                    id="employer"
                                    options={employerNameList}
                                    autoComplete
                                    size="small"
                                    name="employer"
                                    disabled={formDisabled}
                                    value={formik.values.employer}
                                    onInputChange={(field, value) =>
                                        handleEmployerNameChange(value)
                                    }
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            label="Employer Name"
                                            error={
                                                formik.touched.employer &&
                                                formik.errors.employer
                                            }
                                            helperText={
                                                formik.touched.employer &&
                                                formik.errors.employer
                                            }
                                        />
                                    )}
                                />
                            </FormControl>
                            <FormControl fullWidth className="mb-8">
                                <Autocomplete
                                    size="small"
                                    id="designation"
                                    options={DESIGNATION_OPTIONS}
                                    autoComplete
                                    disabled={formDisabled}
                                    onInputChange={(field, value) =>
                                        handleDesignationChange(value)
                                    }
                                    value={formik.values.designation}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            label="Designation"
                                            error={
                                                formik.touched.designation &&
                                                formik.errors.designation
                                            }
                                            helperText={
                                                formik.touched.designation &&
                                                formik.errors.designation
                                            }
                                        />
                                    )}
                                />
                            </FormControl>
                            <FormControl fullWidth className="mb-8">
                                <TextField
                                    name="total_work_experience_in_months"
                                    variant="outlined"
                                    label="Total Work Experience in Months"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={
                                        formik.values
                                            .total_work_experience_in_months
                                    }
                                    disabled={formDisabled}
                                    fullWidth
                                    size="small"
                                    error={
                                        formik.touched
                                            .total_work_experience_in_months &&
                                        formik.errors
                                            .total_work_experience_in_months
                                    }
                                    helperText={
                                        formik.touched
                                            .total_work_experience_in_months &&
                                        formik.errors
                                            .total_work_experience_in_months
                                    }
                                />
                            </FormControl>
                            <FormControl fullWidth className="mb-8">
                                <TextField
                                    name="current_work_experience_in_months"
                                    variant="outlined"
                                    label="Cuurent Work Experience in Months"
                                    type="number"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={
                                        formik.values
                                            .current_work_experience_in_months
                                    }
                                    disabled={formDisabled}
                                    fullWidth
                                    size="small"
                                    error={
                                        formik.touched
                                            .current_work_experience_in_months &&
                                        formik.errors
                                            .current_work_experience_in_months
                                    }
                                    helperText={
                                        formik.touched
                                            .current_work_experience_in_months &&
                                        formik.errors
                                            .current_work_experience_in_months
                                    }
                                />
                            </FormControl>
                        </Box>
                    </Grid>
                ) : (
                    <Grid item xs={12} md={4}>
                        <Box className="py-2">
                            <FormControl fullWidth className="mb-8">
                                <InputLabel size="small" id="entity_type">
                                    Entity Type
                                </InputLabel>
                                <Select
                                    labelId="entity_type"
                                    size="small"
                                    disabled={formDisabled}
                                    name="entity_type"
                                    onBlur={formik.hanleBlur}
                                    value={formik.values.entity_type}
                                    onChange={formik.handleChange}>
                                    <MenuItem value="SHOP">Shop</MenuItem>
                                    <MenuItem value="PARTNERSHIP">
                                        Partnership
                                    </MenuItem>
                                    <MenuItem value="LLP">LLP</MenuItem>
                                    <MenuItem value="PROPRIETERSHIP">
                                        PROPRIETERSHIP
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth className="mb-8">
                                <TextField
                                    name="legal_name"
                                    variant="outlined"
                                    label="Legal Name"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.legal_name}
                                    disabled={formDisabled}
                                    fullWidth
                                    size="small"
                                    error={
                                        formik.touched.legal_name &&
                                        formik.errors.legal_name
                                    }
                                    helperText={
                                        formik.touched.legal_name &&
                                        formik.errors.legal_name
                                    }
                                />
                            </FormControl>
                            <FormGroup className="mb-8">
                                <DatePicker
                                    label="Date of Incorporation"
                                    value={
                                        formik.values
                                            .date_of_joining_or_incorporation
                                    }
                                    onChange={value => {
                                        formik.setFieldValue(
                                            'date_of_joining_or_incorporation',
                                            Date.parse(value),
                                        );
                                    }}
                                    size="small"
                                    name="date_of_joining_or_incorporation"
                                    clearable
                                    disabled={formDisabled}
                                    format="DD/MM/YYYY"
                                    disableFuture
                                    fullWidth
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                        },
                                    }}
                                />
                            </FormGroup>
                        </Box>
                    </Grid>
                )}
            </Grid>
            <div className="grid md:grid-cols-8 xs:grid-cols-2 md:gap-4 xs:gap-2  mt-8 justify-end">
                <div className="col-span-6"></div>
                <div>
                    <Button
                        variant="contained"
                        fullWidth
                        color="secondary"
                        onClick={() => setFormDisabled(prev => !prev)}>
                        Edit
                    </Button>
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={formik.isSubmitting}
                        onClick={formik.handleSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
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

export default IncomeProfile;
