-- AddForeignKey
ALTER TABLE "VariantImage" ADD CONSTRAINT "VariantImage_url_fkey" FOREIGN KEY ("url") REFERENCES "Image"("url") ON DELETE RESTRICT ON UPDATE CASCADE;
