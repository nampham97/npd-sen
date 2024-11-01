import axios from "axios";
import axiosInstance from "./axiosInterceptor";
const xFigmaToken = process.env.NEXT_PUBLIC_XFIGMATOKEN!;

export const APIGetNode = async (idFigma: string) => {
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_FIGMA}/files/${idFigma}`,
        {
            headers: {
                "X-Figma-Token": xFigmaToken,
            }
        })
    return res
};

export const APIGetDetailNode = async (idFigma: string, nodeid: string) => {
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_FIGMA}/files/${idFigma}/nodes?ids=${nodeid}`,
        {
            headers: {
                "X-Figma-Token": xFigmaToken,
            }
        })
    return res
};