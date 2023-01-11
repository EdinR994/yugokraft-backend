import {Controller, Get} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {DataRepository} from "./data.repository";

@ApiTags('data')
@Controller('data')
export class DataController {

    constructor(
        private readonly repository: DataRepository
    ) {}

    @Get('countries')
    getCountryList() {
        return this.repository.getCountryList();
    }

    @Get('categories')
    getCategoryList() {
        return this.repository.getCategoryList();
    }

}