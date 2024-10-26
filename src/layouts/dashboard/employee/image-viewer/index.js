import { Card, CardMedia, Link } from "@mui/material";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import ImgsViewer from 'react-images-viewer'
import MDButton from "components/MDButton";
import axios from "axios";


function ImageView({
    data
}) {

    const [open, setOpen] = useState(false)

    useEffect(() => {
        console.log('debug image view data', data);
    },[]) 

    return (
        <Card
        sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "transparent",
            boxShadow: "none",
            overflow: "visible",
            cursor: 'pointer',
        }}
        >
            <MDBox position="relative" width="100.25%" shadow="xl" borderRadius="xl">
                <CardMedia
                src={data['files_url']}
                component="img"
                sx={{
                    maxWidth: "100%",
                    margin: 0,
                    boxShadow: ({ boxShadows: { md } }) => md,
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: 0,
                }}
                onClick={() => setOpen(true)}
                />
            </MDBox>
            <ImgsViewer
            imgs={[{src: data['files_url']}]}
            isOpen={open}
            onClose={() => setOpen(false)}
            />
            <Link href={data['files_url']} target="_blank"><MDButton sx={{ width: '100%', borderRadius: 0, }}>Download</MDButton></Link>
        </Card>
    )
}

export default ImageView;