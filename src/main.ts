import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { CONFIG } from "./config";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix(CONFIG.API_VERSION);

	const config = new DocumentBuilder()
		.setTitle("Blog Server")
		.setDescription("no description.")
		.setVersion("1.0")
		.addTag("blog")
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);

	await app.listen(8080);
}
bootstrap();
