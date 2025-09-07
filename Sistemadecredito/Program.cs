using System;
using System.Globalization;

namespace SistemaDeCredito
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("\t\tSistema de Crédito Bancário\n\n");

            // Coleta de dados do usuário
            Console.Write("\tNome: ");
            string nome = Console.ReadLine();
            Console.Write("\tIdade: ");
            int idade = int.Parse(Console.ReadLine());
            Console.Write("\tRenda mensal (R$): ");
            decimal renda = decimal.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);
            Console.Write("\tValor desejado (R$): ");
            decimal valor = decimal.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);
            Console.Write("\tParcelas (1 a 24): ");
            int parcelas = int.Parse(Console.ReadLine());

            // Validações usando operadores lógicos
            if (parcelas < 1 || parcelas > 24) // || significa "ou" - menor que 1 OU maior que 24
            {
                Console.WriteLine("\tNúmero de parcelas inválido.");
                return;
            }

            // Verificar elegibilidade - usar && para "e" lógico, == para igualdade
            bool idadeOk = idade >= 18 && idade <= 65; // && significa "e" - maior igual 18 E menor igual 65
            bool rendaOk = renda >= 800;
            bool valorOk = valor <= renda * 5; // Máximo 5x a renda

            // Usar || para verificar se alguma condição falha
            if (!idadeOk || !rendaOk || !valorOk)
            {
                Console.WriteLine("\tCrédito negado.");
                return;
            }

            // Calcular taxa baseada na renda
            decimal taxa;
            if (renda < 2000)
            {
                taxa = 0.05m; // 5% ao mês
            }
            else if (renda >= 2000 && renda <= 5000) // && para intervalo - maior igual 2000 E menor igual 5000
            {
                taxa = 0.03m; // 3% ao mês
            }
            else
            {
                taxa = 0.02m; // 2% ao mês
            }

            // Desconto especial usando == e ||
            if (idade == 30 || renda >= 8000) // || significa "ou" - idade exatamente 30 OU renda alta
            {
                taxa = taxa * 0.9m; // 10% desconto
            }

            // Cálculos finais
            decimal total = valor * (1 + taxa * parcelas);
            decimal valorParcela = total / parcelas;

            // Resultado
            Console.WriteLine($"\t\nCrédito aprovado para {nome}!");
            Console.WriteLine($"\tValor: R$ {valor:F2}");
            Console.WriteLine($"\tTaxa: {taxa * 100:F1}% ao mês");
            Console.WriteLine($"\tParcelas: {parcelas}x de R$ {valorParcela:F2}");
            Console.WriteLine($"\tTotal: R$ {total:F2}");
        }
    }
}