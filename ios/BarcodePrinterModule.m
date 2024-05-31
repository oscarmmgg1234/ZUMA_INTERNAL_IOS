#import "BarcodePrinterModule.h"
#import <React/RCTLog.h>
#import <UIKit/UIKit.h>

@implementation BarcodePrinterModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(printBarcodes:(NSArray *)barcodeBuffers callback:(RCTResponseSenderBlock)callback) {
  // Check if the quantity exceeds 40
  if (barcodeBuffers.count > 30) {
    // Proceed with batch processing
    [self printBarcodesInBatches:barcodeBuffers batchSize:30 callback:callback];
  } else {
    // Handle all in one go
    [self printBatch:barcodeBuffers completionHandler:^(NSInteger statusCode, NSString *message) {
      callback(@[@(statusCode), message]);
    } retryCount:0];
  }
}

- (void)printBarcodesInBatches:(NSArray *)barcodeBuffers batchSize:(NSUInteger)batchSize callback:(RCTResponseSenderBlock)callback {
  // Splitting the array into batches
  NSMutableArray *batches = [NSMutableArray array];
  for (NSUInteger i = 0; i < [barcodeBuffers count]; i += batchSize) {
    NSRange range = NSMakeRange(i, MIN(batchSize, [barcodeBuffers count] - i));
    NSArray *batch = [barcodeBuffers subarrayWithRange:range];
    [batches addObject:batch];
  }
  
  // Recursive function to process each batch
  __block void (^processBatch)(NSArray *, NSUInteger);
  processBatch = ^(NSArray *batches, NSUInteger index) {
    if (index >= [batches count]) {
      callback(@[@(0), @"All printing completed successfully."]);
      return;
    }
    
    NSArray *currentBatch = batches[index];
    [self printBatch:currentBatch completionHandler:^(NSInteger statusCode, NSString *message) {
      if (statusCode != 0) {
        callback(@[@(statusCode), message]);
        return;
      }
      // Process the next batch
      processBatch(batches, index + 1);
    } retryCount:0];
  };
  
  // Start processing batches
  processBatch(batches, 0);
}

- (void)printBatch:(NSArray *)barcodeBuffers completionHandler:(void (^)(NSInteger statusCode, NSString *message))completionHandler retryCount:(NSInteger)retryCount {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSMutableArray *images = [NSMutableArray array];
    for (NSString *base64String in barcodeBuffers) {
      NSData *imageData = [[NSData alloc] initWithBase64EncodedString:base64String options:NSDataBase64DecodingIgnoreUnknownCharacters];
      UIImage *image = [UIImage imageWithData:imageData];
      if (image) {
        [images addObject:image];
      }
    }

    if ([images count] > 0) {
      UIPrintInteractionController *printController = [UIPrintInteractionController sharedPrintController];
      UIPrintInfo *printInfo = [UIPrintInfo printInfo];
      printInfo.outputType = UIPrintInfoOutputPhoto;
      printController.printInfo = printInfo;
      printController.printingItems = images;

      UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
      [printController presentFromRect:rootViewController.view.bounds inView:rootViewController.view animated:YES completionHandler:^(UIPrintInteractionController * _Nonnull printInteractionController, BOOL completed, NSError * _Nullable error) {
        if (completed) {
          completionHandler(0, @"Printing started successfully."); // Status code 0 for success
        } else if (!completed && error == nil) {
          if (retryCount < 1) {
            RCTLogInfo(@"User canceled printing, retrying... Attempt #%ld", (long)(retryCount + 1));
            [self printBatch:barcodeBuffers completionHandler:completionHandler retryCount:retryCount + 1];
          } else {
            completionHandler(1, @"Printing was cancelled by the user after several attempts."); // Status code 1 for cancelled after retries
          }
        } else {
          completionHandler(2, error.localizedDescription ?: @"Unknown error"); // Status code 2 for error
        }
      }];
    } else {
      completionHandler(2, @"No valid images to print."); // Consider no images as an error scenario
    }
  });
}

@end

