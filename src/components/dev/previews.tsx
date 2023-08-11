import React from "react";
import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox-next";
import {PaletteTree} from "./palette";
import AboutMe from "../AboutMe";
import DashboardItem from "../DashboardItem";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/AboutMe">
                <AboutMe/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;