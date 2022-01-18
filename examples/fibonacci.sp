let a be 1
let b be 0
let count be 0

print b
print a
while true
  let temp be a
  increase a by b
  b is temp
  print a

  increase count by 1
  if count is equal to 10
    break
  done
done
