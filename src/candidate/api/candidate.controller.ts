import {
    BadRequestException,
    Body,
    Controller, Get,
    Inject, Param,
    Patch, Query,
    UploadedFiles,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
    Response, UseGuards, Post, UseFilters
} from "@nestjs/common";
import {CandidateService} from "../domain/candidate.service";
import {SetExpiredDto} from "./setExpired.dto";
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes, ApiCreatedResponse,
    ApiParam,
    ApiQuery,
    ApiTags
} from "@nestjs/swagger";
import {FilesInterceptor} from "@nestjs/platform-express";
import {CreateDocument} from "../domain/createDocument";
import { Response as Res } from "express"
import {AuthGuard} from "../../auth/api/auth.guard.";
import {RequestDocumentDto} from "./requestDocument.dto";
import {User} from "../../auth/api/user.decorator";
import {ReadModelRepository} from "./readModel.repository";
import {Translator} from "./translator";
import {extname} from "path"
import {CandidateExceptionFilter} from "./candidate.exceptionFilter";
import {CreateCandidateDto} from "./createCandidate.dto";
import {UpdateProfileDto} from "./updateProfile.dto";
import {TokenRepository} from "../../auth/domain/token.repository";

@ApiTags('candidates')
@Controller('candidates')
@UseFilters(CandidateExceptionFilter)
export class CandidateController {

    constructor(
        @Inject('DomainCandidateService')
        private readonly service: CandidateService,
        @Inject('ReadModelRepository')
        private readonly readModel: ReadModelRepository,
        @Inject('Translator')
        private readonly translator: Translator,
        @Inject('TokenRepository')
        private readonly tokenRepository: TokenRepository
    ) {}

    private allowedFiles = [
        '.doc',
        '.docx',
        '.pdf',
        '.png',
        '.jpg',
        '.jpeg'
    ]

    @Post('save')
    @ApiCreatedResponse({
        schema: {
            type: 'object',
            properties: {
                candidateId: {
                    type: 'string',
                    format: 'uuid'
                }
            }
        }
    })
    @UsePipes(new ValidationPipe())
    async saveCandidate(@Body() dto: CreateCandidateDto) {
        const id = await this.service.save(dto);
        return { candidateId: id };
    }

    @Post('profile')
    @UsePipes(new ValidationPipe())
    async updateProfile(@Body() dto: UpdateProfileDto) {
        await this.service.updateProfile(dto);
        return true;
    }

    @Patch('setExpired')
    @UsePipes(new ValidationPipe())
    async setExpired(@Body() { token }: SetExpiredDto) {
        return this.service.setExpired(token, false)
    }

    @ApiParam({ name: 'id', allowEmptyValue: false })
    @ApiConsumes('multipart/form-data')
    @UsePipes(new ValidationPipe())
    @ApiBody({
            schema: {
                type: 'object',
                properties: {
                    docs: {
                        type: 'string',
                        format: 'binary',
                    },
                    categories: {
                        type: 'object',
                        properties: {
                            filename: {
                                type: 'string',
                                description: 'Category id',
                                example: '83f278e780e4a3b7ef9e4b040dc42ed1d0130e3'
                            }
                        }
                    }
                },
            }
        }
    )
    @Patch('/:id/attach')
    @UseInterceptors(FilesInterceptor('docs'))
    async attachDocuments(@UploadedFiles() documents: Express.Multer.File[], @Body() body: Record<string, string>, @Param('id') id: string) {
        const docs: CreateDocument[] = [];
        const categories = JSON.parse(body.categories);
        for(const document of documents) {
            const categoryId = categories[document.originalname];
            if(!categoryId || !this.allowedFiles.includes(extname(document.originalname).toLowerCase())) {
                throw new BadRequestException();
            }
            docs.push({
                filename: document.originalname,
                buffer: document.buffer,
                categoryId
            })
        }
        return this.service.attachDocuments(id, docs);
    }

    @ApiConsumes('multipart/form-data')
    @UsePipes(new ValidationPipe())
    @ApiQuery({
        name: 'token',
        required: true
    })
    @ApiBody({
            schema: {
                type: 'object',
                properties: {
                    docs: {
                        type: 'string',
                        format: 'binary',
                    },
                    categories: {
                        type: 'object',
                        properties: {
                            filename: {
                                type: 'string',
                                description: 'Category id',
                                example: '83f278e780e4a3b7ef9e4b040dc42ed1d0130e3'
                            }
                        }
                    }
                },
            }
        }
    )
    @UseInterceptors(FilesInterceptor('docs'))
    @Post('/upload')
    async uploadDocuments(@UploadedFiles() documents: Express.Multer.File[], @Body() body: Record<string, string>, @Query('token') token: string) {
        const docs: CreateDocument[] = [];
        const categories = JSON.parse(body.categories);
        if(!token) {
            throw new BadRequestException();
        }
        for(const document of documents) {
            const categoryId = categories[document.originalname];
            if(!categoryId || !this.allowedFiles.includes(extname(document.originalname).toLowerCase())) {
                throw new BadRequestException();
            }
            docs.push({
                filename: document.originalname,
                buffer: document.buffer,
                categoryId
            })
        }
        await this.service.uploadDocuments(token, docs);
        await this.tokenRepository.delete(token);
        return true;
    }

    @Get('documents/all')
    @UsePipes(new ValidationPipe())
    @ApiQuery({
        name: 'candidate_id',
        required: true
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async getAllDocuments(
        @Query('candidate_id') candidateId: string,
        @Response() res: Res
    ) {
        const data = await this.service.getAllDocuments(candidateId);
        res.setHeader(`Content-Disposition`, `attachment; filename="${data.filename}"`)
        res.setHeader('Content-Type', 'application/zip');
        res.send(data.buffer);
    }

    @Get('documents')
    @UsePipes(new ValidationPipe())
    @ApiQuery({
        name: 'candidate_id',
        required: true
    })
    @ApiQuery({
        name: 'category_id',
        required: true
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async getDocuments(
        @Query('category_id') categoryId: string,
        @Query('candidate_id') candidateId: string,
        @Response() res: Res
    ) {
        const data = await this.service.getDocuments(candidateId, categoryId);
        res.setHeader(`Content-Disposition`, `attachment; filename="${data.filename}"`)
        res.setHeader('Content-Type', 'application/zip');
        res.send(data.buffer);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/:id/documents/request')
    @UsePipes(new ValidationPipe())
    async requestDocuments(@Param('id') id: string, @Body() request: RequestDocumentDto, @User() { id: employerId }) {
        return this.service.requestDocuments(id, { categoryIdList: request.categoryIdList, note: request.note, employerId });
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/:id/translated')
    @UsePipes(new ValidationPipe())
    async getTranslatedById(@Param('id') id: string, @User() { id: employerId }) {
        const candidate = await this.readModel.getCandidateById(id, employerId);
        const translated = await this.translator.translateCandidate(candidate.data);
        return { ...candidate, data: translated };
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/age-range')
    async getAgeRange() {
        return await this.service.getAgeRange();
    }

}
