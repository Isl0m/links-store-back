import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'
import { FileResponse } from './file.interface'
import * as sharp from 'sharp'

@Injectable()
export class FileService {
	async saveFiles(
		files: Express.Multer.File[],
		folder: string = 'default'
	): Promise<FileResponse[]> {
		const uploadFolder = `${path}/uploads/${folder}`
		await ensureDir(uploadFolder)

		const res: FileResponse[] = await Promise.all(
			files.map(async (file) => {
				const fileName = `${file.originalname.split('.')[0]}.webp`
				const filePath = `${uploadFolder}/${fileName}`
				// await writeFile(filePath, file.buffer)
				try{
					const metadata = await sharp(file.buffer).metadata();
    if(metadata.height > 2048 || metadata.width > 2048){
      await sharp(file.buffer)
        .toFormat("webp", { quality:25 })
        .toFile(filePath);
    }else if(metadata.height > 1024 || metadata.width > 1024){
      await sharp(file.buffer)
        .toFormat("webp", { quality:50 })
        .toFile(filePath);
    }
    else{
      await sharp(file.buffer)
        .toFormat("webp", { quality:75 })
        .toFile(filePath);
    }

				}catch(e){
					console.log(e)
				}
				return {
					url: `/uploads/${folder}/${fileName}`,
					name: file.originalname,
				}
			})
		)
			

		return res
	}
}
