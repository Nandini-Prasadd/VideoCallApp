import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import {
  Button,
  IconButton,
  TextField,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { AuthContext } from "../contexts/AuthContext";

function HomeComponent() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const { addToUserHistory } = useContext(AuthContext);

  const handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  return (
    <>
      <Box className="navBar">
        <Typography variant="h5" fontWeight="bold">
          ZapChat
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigate("/history")}>
            <RestoreIcon />
          </IconButton>
          <Typography variant="body1">History</Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Box className="homeMain">
        <Paper elevation={3} className="leftPanel">
          <Typography variant="h4" gutterBottom>
            Seamless Video Calls, Just Like Seamless Learning
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Join a meeting instantly by entering a code below.
          </Typography>

          <Box className="meetingInputGroup">
            <TextField
              onChange={(e) => setMeetingCode(e.target.value)}
              label="Enter Meeting Code"
              variant="outlined"
              fullWidth
            />
            <Button variant="contained" onClick={handleJoinVideoCall}>
              Join
            </Button>
          </Box>
        </Paper>

        <Box className="rightPanel">
          <img src="/logo3.png" alt="Video call logo" />
        </Box>
      </Box>
    </>
  );
}

export default withAuth(HomeComponent);
