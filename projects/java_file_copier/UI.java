import javafx.application.*;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.scene.layout.*;
import javafx.stage.Stage;

public class UI extends Application
{
  @Override
  public void start(Stage primaryStage)
  {
    primaryStage.setTitle("Hello There");
    
    Button btn = new Button();
    btn.setText("Hello");
    btn.setOnAction((event) -> Platform.exit());

    TextField srcDir = new TextField("Source Directory Path");
    srcDir.setOnAction((event) -> checkPath(srcDir));

    StackPane root = new StackPane();
    root.getChildren().add(btn);
    root.getChildren().add(srcDir);

    primaryStage.setScene(new Scene(root, 300, 250));
    primaryStage.show();
  }

  public void checkPath(TextField dir)
  {
    if(dir.getText().compareTo("Fuck") != 0)
    {
      dir.setText("Shit");
    }
  }

  public static void main(String[] args)
  {
    launch(args);
  }
}
