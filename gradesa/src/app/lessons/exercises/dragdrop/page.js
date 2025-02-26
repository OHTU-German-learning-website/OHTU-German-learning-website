"use client";
import styles from "../../../page.module.css";
import DragdropLayout from "./layout";
import { Grid } from "@radix-ui/themes";
import { Box } from "@/components/ui/box/box";

export default function Dragdrop({}) {
  return (
    <DragdropLayout>
      <div className={styles.page}>
        <div className="exercise-container">
          <h1>Übung 1 Substantiv</h1>
          <Box variant="outline" size="lg" className="top-box">
            Kurs <br></br>
            Schule <br></br>
            Auto
          </Box>
          <Grid columns="3" gap="3" rows="2" width="auto" justify="center">
            <Box gridrow="2 / 2" variant="outline" size="xl" minwidth="500px">
              Kurs
            </Box>
            <Box gridrow="2 / 2" variant="outline" size="xl">
              Schule
            </Box>
            <Box gridrow="2 / 2" variant="outline" size="xl">
              Auto
            </Box>
          </Grid>
        </div>
      </div>
    </DragdropLayout>
  );
}
