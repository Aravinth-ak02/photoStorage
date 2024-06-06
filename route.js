import express from "express";
import { GeneralDetails, uploadFile, listFiles, favouriteAddRemove, binFiles, deleteBinFiles } from "./controller.js"
let Route = express.Router();

Route.get('/setting', GeneralDetails);
Route.post('/file/upload', uploadFile);
Route.post('/file/list', listFiles);
Route.post('/favourite', favouriteAddRemove);
Route.post('/delete/file', binFiles);
Route.post('/remove/bin', deleteBinFiles);

export { Route };