import {Module} from "@nestjs/common";
import {DataController} from "./data.controller";
import {DataRepository} from "./data.repository";

@Module({
    controllers: [DataController],
    providers: [DataRepository]
})
export class DataModule {

}