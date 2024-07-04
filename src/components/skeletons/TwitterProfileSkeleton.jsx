import React from 'react';
import { Box, Typography, Avatar, Grid, Paper, Divider, CssBaseline } from '@mui/material';
import { Skeleton, ThemeProvider, createTheme } from '@mui/material';

const TwitterProfileSkeleton = () => {
  // Define the dark mode theme
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#1e1e1e'
      },
      text: {
        primary: '#ffffff',
        secondary: '#b0b0b0'
      }
    }
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Paper elevation={3} sx={{ p: 2, backgroundColor: 'background.paper' }}>
          <Box sx={{ position: 'relative', height: 200 }}>
            <Skeleton variant="rectangular" width="100%" height="100%" />
            <Avatar
              sx={{
                width: 100,
                height: 100,
                position: 'absolute',
                bottom: -50,
                left: 16,
                border: '4px solid',
                borderColor: 'background.paper'
              }}
            />
          </Box>
          <Box sx={{ mt: 6, mb: 2 }}>
            <Typography variant="h6">
              <Skeleton width="60%" />
            </Typography>
            <Typography variant="body2">
              <Skeleton width="40%" />
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <Skeleton width="80%" />
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                <Skeleton width="50%" />
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                <Skeleton width="50%" />
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          <Box sx={{ mt: 2 }}>
            {[...Array(3)].map((_, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Skeleton variant="rectangular" width="100%" height={50} />
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default TwitterProfileSkeleton;
