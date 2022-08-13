import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { CONFIG } from "./config";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix(CONFIG.API_VERSION);

	const config = new DocumentBuilder()
		.setTitle("Blog Server")
		.setVersion("1.0")
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("docs", app, document);

	await app.listen(8080);
}
bootstrap();
