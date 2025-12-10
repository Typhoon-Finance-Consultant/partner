import { Box, Paper, Typography, Icon } from '@mui/material';
import React from 'react';
import { AccountCircle } from '@mui/icons-material';

const IconCard = props => {
    const {
        iconName = <AccountCircle />,
        boxTitle,
        boxValue,
        valueClassName = '',
        titleClassName = '',
    } = props;
    return (
        <Box className="h-full">
            <Paper
                elevation={0}
                sx={{
                    height: { xs: '120px', sm: '140px' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: { xs: 2, sm: 3 },
                    my: { xs: 1, sm: 2, lg: 4 },
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(255, 0, 0, 0.1)',
                        borderColor: '#FF0000',
                    },
                }}>
                <Box
                    className="flex-shrink-0 mb-2"
                    sx={{
                        color: '#FF0000',
                        '& .MuiSvgIcon-root': {
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        },
                    }}>
                    {iconName}
                </Box>
                <Box className="text-center w-full">
                    <Typography
                        className={`text-gray-600 font-medium ${titleClassName}`}
                        sx={{
                            fontSize: {
                                xs: '0.75rem',
                                sm: '0.875rem',
                                md: '0.95rem',
                            },
                            lineHeight: 1.3,
                            mb: 0.5,
                        }}>
                        {boxTitle}
                    </Typography>
                    <Typography
                        className={`text-gray-900 font-bold ${valueClassName}`}
                        sx={{
                            fontSize: {
                                xs: '1.75rem',
                                sm: '2.25rem',
                                md: '2.5rem',
                            },
                            lineHeight: 1.2,
                            color: '#1f2937',
                        }}>
                        {boxValue}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default IconCard;
