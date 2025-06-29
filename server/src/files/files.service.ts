import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
@Injectable()
export class FilesService {
     
    
    async createFile(file): Promise<string> {
        try {
            const fileName = uuid.v4() + path.extname(file.originalname);
            const filePath = path.resolve(process.cwd(), 'static'); 
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }
            await fs.promises.writeFile(path.join(filePath, fileName), file.buffer);
            return fileName;
        } catch (e) {
            console.log(e);
            throw new HttpException('Ошибка при сохранении файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    async deleteFile(fileName: string): Promise<void> {
        try {
            const filePath = path.resolve(__dirname, '..', 'static', fileName);
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            } else {
                throw new HttpException('Файл не найден', HttpStatus.NOT_FOUND);
            }
        } catch (e) {
            console.log(e);
            throw new HttpException('Ошибка при удалении файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    
    
    
}    
