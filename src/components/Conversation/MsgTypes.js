// File: components/MsgTypes.js
import React from "react";
import { Box, Stack, Typography, IconButton } from "@mui/material";
import { DownloadSimple, Image } from "phosphor-react";
import { useTheme } from "@mui/material/styles";

// theme.palette.mode === "light"
//               ? "#F8FAFF"
//               : theme.palette.background,

const baseBox = (incoming, theme) => ({
  backgroundColor: incoming
    ? theme.palette.mode === "light"
      ? "#F0F2F5"  
      : theme.palette.background.paper
    : theme.palette.primary.main,
  borderRadius: 1.5,
  width: "max-content",
  margin: "5px",
});


export const TextMsg = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box p={1.5} sx={baseBox(el.incoming, theme)}>
        <Typography variant="body2" color={el.incoming ? theme.palette.text : "#fff"}>
          {el.text || el.message}
        </Typography>
      </Box>
    </Stack>
  );
};

export const MediaMsg = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box p={1.5} sx={baseBox(el.incoming, theme)}>
        <img src={el.img || el.file} alt="media" style={{ maxHeight: 210, borderRadius: "10px" }} />
        <Typography variant="body2" color={el.incoming ? theme.palette.text : "#fff"}>
          {el.text || el.message}
        </Typography>
      </Box>
    </Stack>
  );
};

export const DocMsg = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box p={1.5} sx={baseBox(el.incoming, theme)}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Image size={48} />
            <Typography variant="caption">{el.file || "Document.pdf"}</Typography>
            <IconButton><DownloadSimple /></IconButton>
          </Stack>
          <Typography variant="body2" color={el.incoming ? theme.palette.text : "#fff"}>
            {el.text || el.message}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

export const LinkMsg = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box p={1.5} sx={baseBox(el.incoming, theme)}>
        <img src={el.preview} alt={el.message} style={{ maxHeight: 210, borderRadius: "10px" }} />
        <Typography variant="body2" color={el.incoming ? theme.palette.text : "#fff"}>
          {el.text || el.message}
        </Typography>
      </Box>
    </Stack>
  );
};

export const ReplyMsg = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box p={1.5} sx={baseBox(el.incoming, theme)}>
        <Typography variant="body2" color={el.incoming ? theme.palette.text : "#fff"}>
          {el.reply || el.message}
        </Typography>
      </Box>
    </Stack>
  );
};