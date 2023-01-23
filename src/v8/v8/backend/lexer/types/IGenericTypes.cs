namespace v8.backend.lexer.types
{

    /*
    IGenericType is a interface for standardize the programing type classes
    the IGenericType need to contains

    - IGenericType need to contaisn:
    Rule <- Boolean for verify if the given char is from the type

    */
    public interface IGenericType 
    {
        bool Rule(string c);
        dynamic getValues();
    }
}