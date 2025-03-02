"use client"
import {
  Container,
  Typography,
  Box,
  IconButton,
  Link,
  Divider,
} from "@mui/material"
import GitHubIcon from "@mui/icons-material/GitHub"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import ForestIcon from "@mui/icons-material/Forest"

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: "#cccecf", color: "#333", py: 3, mt: 4 }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          textAlign="center"
        >
          <Box mb={{ xs: 2, md: 0 }} textAlign="left">
            <div className="flex items-center gap-x-2">
              <ForestIcon fontSize="small" sx={{ color: "green" }} />
              <Typography variant="h6" fontWeight="bold">
                PeopleFirst
              </Typography>
            </div>
            <Typography
              variant="body2"
              color="text.secondary"
              maxWidth="300px"
              fontWeight="600"
            >
              Connecting people in need with real-time support from the
              community.
            </Typography>
          </Box>

          <Box display="flex" gap={3}>
            <Link
              href="#about"
              color="#333"
              fontWeight="500"
              underline="none"
              sx={{ "&:hover": { color: "black" } }}
            >
              About Us
            </Link>
            <Link
              href="#process"
              color="#333"
              fontWeight="500"
              underline="none"
              sx={{ "&:hover": { color: "black" } }}
            >
              Process
            </Link>
            <Link
              href="#contact"
              color="#333"
              fontWeight="500"
              underline="none"
              sx={{ "&:hover": { color: "black" } }}
            >
              Contact Us
            </Link>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="right"
          alignItems="center"
          textAlign="center"
        >
          <Box>
            <IconButton
              component="a"
              href="https://github.com/omnavneet"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#333", "&:hover": { color: "green" } }}
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://linkedin.com/in/omnavneet"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#333", "&:hover": { color: "blue" } }}
            >
              <LinkedInIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
