#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

#define OLED_SDA 21
#define OLED_SCL 22
#define OLED_ADDR 0x3C

#define BTN_FLIP   25
#define BTN_KNOW   26
#define BTN_REPEAT 27

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

struct Card {
  const char* word;
  const char* translation;
};

Card cards[] = {
  { "hello",  "pryvit" },
  { "book",   "knyha" },
  { "water",  "voda" },
  { "table",  "stil" },
  { "school", "shkola" }
};

const int TOTAL = sizeof(cards) / sizeof(cards[0]);

int cardIndex = 0;
int knowCount = 0;
bool showTranslation = false;

bool isPressed(int pin) {
  return digitalRead(pin) == LOW;
}

void drawCard() {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);

  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("Card ");
  display.print(cardIndex + 1);
  display.print("/");
  display.print(TOTAL);

  display.setTextSize(2);
  display.setCursor(0, 18);
  display.print(cards[cardIndex].word);

  display.setTextSize(1);

  if (showTranslation) {
    display.setCursor(0, 48);
    display.print("Translation:");
    display.setCursor(0, 56);
    display.print(cards[cardIndex].translation);
  } else {
    display.setCursor(0, 48);
    display.print("1-translate");
    display.setCursor(0, 56);
    display.print("2-know 3-repeat");
  }

  display.display();
}

void drawResult() {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);

  display.setCursor(20, 5);
  display.print("Test finished");

  display.setCursor(0, 24);
  display.print("Know: ");
  display.print(knowCount);

  display.setCursor(0, 38);
  display.print("Repeat: ");
  display.print(TOTAL - knowCount);

  display.setCursor(0, 56);
  display.print("Blue = restart");

  display.display();
}

void nextCard(bool knowsWord) {
  if (knowsWord) {
    knowCount++;
  }

  cardIndex++;
  showTranslation = false;

  if (cardIndex >= TOTAL) {
    drawResult();
  } else {
    drawCard();
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("=== Learnly started ===");

  pinMode(BTN_FLIP, INPUT_PULLUP);
  pinMode(BTN_KNOW, INPUT_PULLUP);
  pinMode(BTN_REPEAT, INPUT_PULLUP);

  Wire.begin(OLED_SDA, OLED_SCL);

  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
    Serial.println("OLED NOT FOUND");
    while (true) {
      delay(100);
    }
  }

  Serial.println("OLED FOUND");

  display.clearDisplay();
  display.display();

  drawCard();
}

void loop() {
  if (cardIndex >= TOTAL) {
    if (isPressed(BTN_KNOW)) {
      cardIndex = 0;
      knowCount = 0;
      showTranslation = false;
      drawCard();
      delay(300);
    }

    return;
  }

  if (isPressed(BTN_FLIP)) {
    showTranslation = !showTranslation;
    drawCard();
    delay(300);
  }

  if (isPressed(BTN_KNOW)) {
    nextCard(true);
    delay(300);
  }

  if (isPressed(BTN_REPEAT)) {
    nextCard(false);
    delay(300);
  }
}