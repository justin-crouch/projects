import java.util.Scanner;
import java.util.InputMismatchException;
import java.util.ArrayList;
import java.io.File;

public class Application
{
  public static final String ERROR = ANSI.color("ERROR:", ANSI.BG_RED) + " ";
  
  public static void main(String[] args)
  {
    Scanner scnr = new Scanner(System.in);
    String sourceStr, destStr;
    String[] extensions;
    File sourceDir, destDir;
    ArrayList<File> fileList = new ArrayList<File>();
    int choice = 0;

    ANSI.clear();
    System.out.println(logo() + "\n" + options() + "\n");

    while(choice < 1 || choice > 2)
    {
      try
      {
	System.out.print("Enter Option: ");
	choice = scnr.nextInt();

	if(choice < 1 || choice > 2)
	{
	  throw new Exception(
	    ERROR +
	    ANSI.color("Option not found\n", ANSI.RED)
	  );
	}
      } catch(InputMismatchException e)
      {
	System.out.println(
	  ERROR +
	  ANSI.color("Input must be of type INT\n", ANSI.RED)
	);
	scnr.next();
      } catch(Exception e)
      {
	System.out.println(e.getMessage());
      }
    }
    scnr.nextLine();
  
    ANSI.clear();
    System.out.println(logo());

    // Ask for source directory for searching
    do
    {
      System.out.print("Source Directory: ");
      sourceStr = scnr.nextLine();

      sourceDir = new File(sourceStr);
    
      System.out.print((sourceDir.exists() && sourceDir.isDirectory())? "" : ERROR + ANSI.color("Path does not exist or is not a directory\n\n", ANSI.RED));
    } while(!(sourceDir.exists() && sourceDir.isDirectory()));

    // Ask for target directory to copy to
    do
    {
      System.out.print("Destination Directory: ");
      destStr = scnr.nextLine();

      destDir = new File(destStr);
    
      System.out.print((destDir.exists() && destDir.isDirectory())? "" : ERROR + ANSI.color("Path does not exist or is not a directory\n\n", ANSI.RED));
    } while(!(destDir.exists() && destDir.isDirectory()));

    switch(choice)
    {
      case 1:
        System.out.print("Extensions " + ANSI.color("(Space-Separated, Ignore Period)", ANSI.PURPLE) + ": ");
	extensions = scnr.nextLine().split(" ");

	Backup.search(sourceDir, extensions, fileList);
	System.out.println();
	Backup.copy(fileList, destDir);
	break;

      case 2:
	Compare.moveDuplicates(scnr, sourceDir, destDir);
	break;
    }
  }

  public static String logo()
  {
    String color = ANSI.YELLOW;

    return "====================================\n" +
    ANSI.color("    _____\\    _______\n", color) +
    ANSI.color("   /      \\  |      /\\\n", color) +
    ANSI.color("  /_______/  |_____/  \\\n", color) +
    ANSI.color(" |   \\   /        /   /\n", color) +
    ANSI.color("  \\   \\         \\/   /\n", color) +
    ANSI.color("   \\  /          \\__/_\n", color) +
    ANSI.color("    \\/ ____    /\\\n", color) +
    ANSI.color("      /  \\    /  \\\n", color) +
    ANSI.color("     /\\   \\  /   /\n", color) +
    ANSI.color("       \\   \\/   /\n", color) +
    ANSI.color("        \\___\\__/\n", color) +
    "====================================\n";
  }

  public static String options()
  {
    String selectColor = ANSI.CYAN;
    return  ANSI.color("[1]", selectColor) + " Search and Copy\n" +
	    ANSI.color("[2]", selectColor) + " Remove Duplicates";
  }
}
