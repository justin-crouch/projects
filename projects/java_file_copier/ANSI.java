public class ANSI
{
  public static final String RESET  = "\u001B[0m";

  public static final String BLACK  = "\u001B[30m";
  public static final String RED    = "\u001B[31m";
  public static final String GREEN  = "\u001B[32m";
  public static final String YELLOW = "\u001B[33m";
  public static final String BLUE   = "\u001B[34m";
  public static final String PURPLE = "\u001B[35m";
  public static final String CYAN   = "\u001B[36m";
  public static final String WHITE  = "\u001B[37m";

  public static final String BG_BLACK  = "\u001B[40m";
  public static final String BG_RED    = "\u001B[41m";
  public static final String BG_GREEN  = "\u001B[42m";
  public static final String BG_YELLOW = "\u001B[43m";
  public static final String BG_BLUE   = "\u001B[44m";
  public static final String BG_PURPLE = "\u001B[45m";
  public static final String BG_CYAN   = "\u001B[46m";
  public static final String BG_WHITE  = "\u001B[47m";

  public static final String CLEAR     = "\033[H\033[2J";
  public static final String CLEARLINE = "\033[2K";

  public static String color(String text, String color)
  {
    return color + text + RESET;
  }

  public static void clear()
  {
    System.out.print(CLEAR);
    System.out.flush();
  }

  public static void clearLine()
  {
    System.out.print(CLEARLINE);
    System.out.flush();
  }

  public static String up(int n)
  {
    return "\033[" + n + "A";
  }

  public static String down(int n)
  {
    return "\033[" + n + "B";
  }

  public static String right(int n)
  {
    return "\033[" + n + "C";
  }

  public static String left(int n)
  {
    return "\033[" + n + "D";
  }

  private ANSI()
  {}
}
