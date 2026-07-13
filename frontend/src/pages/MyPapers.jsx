import { useEffect, useState } from "react";
import {
    getDocuments,
    deleteDocument,
} from "@/services/paperService"; import PaperCard from "@/components/papers/PaperCard";
import { useNavigate } from "react-router-dom";
export default function MyPapers() {

    const [papers, setPapers] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {

        async function loadPapers() {

            try {

                const response = await getDocuments();

                console.log(response.data);

                setPapers(response.data);

            }

            catch (err) {

                console.error(err);

            }

        }

        loadPapers();

    }, []);
    const handleOpen = (paper) => {

        navigate("/chat", {
            state: {
                documentId: paper.id,
                fileName: paper.filename,
                fileSize: paper.file_size,
            },
        });

    };

    const handleContinue = (paper) => {

        navigate("/chat", {
            state: {
                documentId: paper.id,
                fileName: paper.filename,
                fileSize: paper.file_size,
            },
        });

    };

    const handleDelete = async (paper) => {

        const confirmDelete = window.confirm(
            `Delete "${paper.filename}" ?`
        );

        if (!confirmDelete) return;

        try {

            await deleteDocument(paper.id);

            setPapers((prev) =>
                prev.filter((p) => p.id !== paper.id)
            );

        }

        catch (err) {

            console.error(err);

            alert("Failed to delete paper");

        }

    };
    return (

        <div className="p-4 md:p-8">

            <h1 className="text-3xl font-bold mb-8">

                My Papers

            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                {papers.map((paper) => (

                    <PaperCard

                        key={paper.id}

                        id={paper.id}

                        title={paper.filename}

                        size={`${(paper.file_size / (1024 * 1024)).toFixed(2)} MB`}

                        onOpen={() => handleOpen(paper)}

                        onContinue={() => handleContinue(paper)}

                        onDelete={() => handleDelete(paper)}

                    />

                ))}

            </div>

        </div>

    );

}